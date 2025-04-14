import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  Inbox as InboxIcon
} from '@mui/icons-material';
import ReferralRequestsList from '../components/referrals/ReferralRequestsList';
import ReferralRequestDetail from '../components/referrals/ReferralRequestDetail';
import EmptyState from '../components/common/EmptyState';
import { useAuthContext } from '../context/AuthContext';
import { setAlert } from '../store/actions/uiActions';
import apiService from '../services/apiService';

const ReferralRequests = () => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestDetailsLoading, setRequestDetailsLoading] = useState(false);
  
  // Fetch referral requests
  useEffect(() => {
    const fetchReferralRequests = async () => {
      try {
        setLoading(true);
        
        // Fetch received requests (if user is a referrer)
        if (user.user_type === 'referrer' || user.user_type === 'admin') {
          const receivedResponse = await apiService.referrals.getRequests({ received: true });
          setReceivedRequests(receivedResponse.data.data.referralRequests);
        }
        
        // Fetch sent requests
        const sentResponse = await apiService.referrals.getRequests({ sent: true });
        setSentRequests(sentResponse.data.data.referralRequests);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching referral requests:', error);
        dispatch(setAlert('Failed to load referral requests', 'error'));
        setLoading(false);
      }
    };

    fetchReferralRequests();
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedRequest(null);
  };

  const handleViewRequestDetails = async (requestId) => {
    try {
      setRequestDetailsLoading(true);
      const response = await apiService.referrals.getById(requestId);
      setSelectedRequest(response.data.data.referralRequest);
      setRequestDetailsLoading(false);
    } catch (error) {
      console.error('Error fetching referral request details:', error);
      dispatch(setAlert('Failed to load request details', 'error'));
      setRequestDetailsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await apiService.referrals.approveRequest(requestId);
      dispatch(setAlert('Referral request approved successfully', 'success'));
      
      // Update received requests list
      const updatedRequests = receivedRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved' } 
          : request
      );
      setReceivedRequests(updatedRequests);
      
      // Update selected request if viewing details
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: 'approved' });
      }
    } catch (error) {
      console.error('Error approving referral request:', error);
      dispatch(setAlert('Failed to approve request', 'error'));
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await apiService.referrals.rejectRequest(requestId);
      dispatch(setAlert('Referral request rejected', 'success'));
      
      // Update received requests list
      const updatedRequests = receivedRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' } 
          : request
      );
      setReceivedRequests(updatedRequests);
      
      // Update selected request if viewing details
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: 'rejected' });
      }
    } catch (error) {
      console.error('Error rejecting referral request:', error);
      dispatch(setAlert('Failed to reject request', 'error'));
    }
  };

  const handleStartChat = async (userId) => {
    try {
      // Start or get existing conversation
      const response = await apiService.messages.startConversation(userId);
      const conversationId = response.data.data.conversation.id;
      
      // Redirect to messages page with this conversation
      window.location.href = `/messages?conversation=${conversationId}`;
    } catch (error) {
      console.error('Error starting conversation:', error);
      dispatch(setAlert('Failed to start conversation', 'error'));
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (selectedRequest) {
      return (
        <ReferralRequestDetail
          request={selectedRequest}
          loading={requestDetailsLoading}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onStartChat={handleStartChat}
          onBack={() => setSelectedRequest(null)}
        />
      );
    }

    // Received requests tab (only shown to referrers)
    if (tabValue === 0 && (user.user_type === 'referrer' || user.user_type === 'admin')) {
      return (
        <ReferralRequestsList
          requests={receivedRequests}
          loading={loading}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          onViewDetails={handleViewRequestDetails}
        />
      );
    }

    // Sent requests tab
    const sentTabIndex = user.user_type === 'referrer' || user.user_type === 'admin' ? 1 : 0;
    if (tabValue === sentTabIndex) {
      if (sentRequests.length === 0) {
        return (
          <EmptyState
            title="No sent referral requests"
            description="You haven't sent any referral requests yet"
            icon="send"
            actionText="Search for jobs"
            actionLink="/jobs"
          />
        );
      }
      
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            Your Sent Requests
          </Typography>
          
          {/* Custom component to show sent requests */}
          <Paper elevation={1}>
            {sentRequests.map(request => (
              <Box key={request.id} p={2} mb={2}>
                <Typography variant="subtitle1">
                  {request.job.title} at {request.job.company.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Typography>
                <Button 
                  size="small"
                  onClick={() => handleViewRequestDetails(request.id)}
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </Paper>
        </Box>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Referral Requests
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          {(user.user_type === 'referrer' || user.user_type === 'admin') && (
            <Tab icon={<InboxIcon />} label="Received Requests" />
          )}
          <Tab icon={<SendIcon />} label="Sent Requests" />
        </Tabs>
      </Paper>
      
      {renderContent()}
    </Container>
  );
};

export default ReferralRequests; 