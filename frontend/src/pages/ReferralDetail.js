import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  Chip,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Work,
  Business,
  Person,
  CalendarToday,
  LocationOn,
  AttachFile,
  Send,
  ArrowBack,
  Edit,
  Delete,
  AccessTime,
  Check,
  Close,
  Email,
  LinkedIn
} from '@mui/icons-material';
import { 
  getReferralById, 
  updateReferralStatus, 
  deleteReferralRequest, 
  addReferralMessage 
} from '../store/actions/referralActions';
import { setAlert } from '../store/actions/uiActions';

const statusColors = {
  pending: 'warning',
  accepted: 'info',
  rejected: 'error',
  completed: 'success'
};

const StatusTimeline = ({ referral }) => {
  const timelineItems = [
    {
      status: 'created',
      date: referral.createdAt,
      icon: <AccessTime />,
      label: 'Request Created'
    }
  ];
  
  // Add status updates based on the referral history
  if (referral.statusHistory && referral.statusHistory.length > 0) {
    referral.statusHistory.forEach(update => {
      let icon = <AccessTime />;
      if (update.status === 'accepted') icon = <Check />;
      if (update.status === 'rejected') icon = <Close />;
      if (update.status === 'completed') icon = <Check />;
      
      timelineItems.push({
        status: update.status,
        date: update.updatedAt,
        icon,
        label: `${update.status.charAt(0).toUpperCase() + update.status.slice(1)}`
      });
    });
  }
  
  // Sort timeline items by date
  timelineItems.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return (
    <List>
      {timelineItems.map((item, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: item.status === 'rejected' ? 'error.main' : 'primary.main' }}>
              {item.icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.label}
            secondary={format(new Date(item.date), 'MMM dd, yyyy HH:mm')}
          />
        </ListItem>
      ))}
    </List>
  );
};

const ReferralDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referral, loading, error } = useSelector(state => state.referrals);
  const { user } = useSelector(state => state.auth);
  const [message, setMessage] = useState('');
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState('');
  const [responseNote, setResponseNote] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  useEffect(() => {
    dispatch(getReferralById(id));
  }, [dispatch, id]);
  
  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Are you sure you want to ${newStatus} this referral request?`)) {
      dispatch(updateReferralStatus(id, { status: newStatus }));
    }
  };
  
  const handleDeleteReferral = () => {
    if (window.confirm('Are you sure you want to delete this referral request? This action cannot be undone.')) {
      dispatch(deleteReferralRequest(id));
      navigate('/referrals');
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(addReferralMessage(id, { content: message }));
      setMessage('');
    } else {
      dispatch(setAlert('Message cannot be empty', 'error'));
    }
  };
  
  const handleResponseOpen = (type) => {
    setResponseType(type);
    setResponseDialogOpen(true);
  };
  
  const handleResponseClose = () => {
    setResponseDialogOpen(false);
    setResponseNote('');
  };
  
  const handleResponseSubmit = () => {
    dispatch(updateReferralStatus(
      id, 
      { 
        status: responseType, 
        notes: responseNote || undefined 
      }
    ));
    handleResponseClose();
    
    // Show confirmation alert
    const message = responseType === 'accepted' 
      ? 'You have accepted the referral request'
      : 'You have declined the referral request';
    
    dispatch(setAlert(message, responseType === 'accepted' ? 'success' : 'info'));
  };
  
  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!referral) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Referral not found</Alert>
      </Container>
    );
  }
  
  // Determine if current user is the seeker or referrer
  const isSeeker = user.id === referral.seeker.id;
  const isReferrer = user.id === referral.referrer.id;
  const isAdmin = user.role === 'admin';
  
  // Determine available actions based on status and user role
  const showAcceptReject = isReferrer && referral.status === 'pending';
  const showComplete = isReferrer && referral.status === 'accepted';
  const showDelete = (isSeeker && referral.status === 'pending') || isAdmin;
  
  // Format dates
  const createdDate = format(new Date(referral.createdAt), 'MMMM d, yyyy');
  const updatedDate = format(new Date(referral.updatedAt), 'MMMM d, yyyy h:mm a');
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/referrals')}
        sx={{ mb: 2 }}
      >
        Back to Referrals
      </Button>
      
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" component="h1">
                Referral Request
              </Typography>
              <Chip 
                label={referral.status.charAt(0).toUpperCase() + referral.status.slice(1)} 
                color={statusColors[referral.status]} 
              />
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Created on {createdDate}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {/* Action Buttons */}
            <Box display="flex" gap={2} mt={2}>
              {showAcceptReject && (
                <>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleStatusChange('accepted')}
                  >
                    Accept Request
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleStatusChange('rejected')}
                  >
                    Decline Request
                  </Button>
                </>
              )}
              
              {showComplete && (
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => handleStatusChange('completed')}
                >
                  Mark as Completed
                </Button>
              )}
              
              {showDelete && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<Delete />}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  Delete Request
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Job Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Job Details"
              avatar={<Work color="primary" />}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {referral.job.title}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Business sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  {referral.job.company.name}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  {referral.job.location}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1 }} color="action" />
                <Typography variant="body2" color="text.secondary">
                  Posted on {format(new Date(referral.job.createdAt), 'MMMM d, yyyy')}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body2" paragraph>
                {referral.job.description}
              </Typography>
              
              <Button 
                variant="outlined" 
                href={`/jobs/${referral.job.id}`}
                sx={{ mt: 2 }}
              >
                View Full Job Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* User Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Participants"
              avatar={<Person color="primary" />}
            />
            <CardContent>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Job Seeker
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar src={referral.seeker.avatar || ''} sx={{ mr: 2 }}>
                    {referral.seeker.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {referral.seeker.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {referral.seeker.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Referrer
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar src={referral.referrer.avatar || ''} sx={{ mr: 2 }}>
                    {referral.referrer.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {referral.referrer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {referral.referrer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {referral.referrer.company ? `Works at ${referral.referrer.company}` : ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Request Details */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Request Details"
              subheader={`Last updated: ${updatedDate}`}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Request Message
              </Typography>
              <Typography variant="body1" paragraph>
                {referral.message || 'No initial message provided.'}
              </Typography>
              
              {referral.resume && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resume
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFile />}
                    href={referral.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Button>
                </Box>
              )}
              
              {referral.additionalDocuments && referral.additionalDocuments.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Documents
                  </Typography>
                  <List>
                    {referral.additionalDocuments.map((doc, index) => (
                      <ListItem key={index} disablePadding>
                        <Button
                          startIcon={<AttachFile />}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.name || `Document ${index + 1}`}
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Communication History */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Communication History" />
            <CardContent>
              {referral.messages && referral.messages.length > 0 ? (
                <List>
                  {referral.messages.map((msg, index) => (
                    <ListItem 
                      key={index}
                      alignItems="flex-start"
                      sx={{ 
                        bgcolor: msg.sender.id === user.id ? 'rgba(0, 0, 255, 0.05)' : 'inherit',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={msg.sender.avatar || ''}>
                          {msg.sender.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {msg.sender.name}
                            <Typography 
                              component="span" 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}
                            </Typography>
                          </Typography>
                        }
                        secondary={msg.content}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No messages yet
                </Typography>
              )}
              
              {/* Message Input */}
              <Box component="form" onSubmit={handleSendMessage} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label="Type a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      multiline
                      rows={2}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      endIcon={<Send />}
                      sx={{ height: '100%' }}
                      disabled={message.trim() === ''}
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onClose={handleResponseClose}>
        <DialogTitle>
          {responseType === 'accepted' && 'Accept Referral Request'}
          {responseType === 'rejected' && 'Decline Referral Request'}
          {responseType === 'completed' && 'Mark Referral as Completed'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Add a note (optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResponseClose}>Cancel</Button>
          <Button 
            onClick={handleResponseSubmit} 
            variant="contained" 
            color={
              responseType === 'accepted' ? 'primary' : 
              responseType === 'completed' ? 'success' : 
              'error'
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Cancel Referral Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this referral request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>No, Keep It</Button>
          <Button onClick={handleDeleteReferral} variant="contained" color="error">
            Yes, Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReferralDetail; 