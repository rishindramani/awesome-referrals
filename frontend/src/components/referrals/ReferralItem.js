import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Avatar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  BusinessCenter as JobIcon,
  Business as CompanyIcon,
  Person as PersonIcon,
  CalendarToday as DateIcon,
  ArrowForward as ArrowIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

// Helper function to determine status color
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'info';
    case 'completed':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

// Helper function for readable status labels
const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'completed':
      return 'Completed';
    case 'rejected':
      return 'Declined';
    default:
      return status;
  }
};

const ReferralItem = ({ referral }) => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Determine if user is seeker or referrer for this referral
  const isSeeker = user.id === referral.seekerId;
  const isReferrer = user.id === referral.referrerId;
  
  // Format date for display
  const updatedAt = formatDistanceToNow(new Date(referral.updatedAt), { addSuffix: true });
  
  const handleViewDetails = () => {
    navigate(`/referrals/${referral.id}`);
  };
  
  // Determine counterpart (if user is seeker, show referrer, and vice versa)
  const counterpart = isSeeker ? referral.referrer : referral.seeker;
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Grid container spacing={2}>
        {/* Left side - Job & Company Info */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <JobIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2" noWrap>
                {referral.job?.title || 'Job Title Not Available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CompanyIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1" color="text.secondary" noWrap>
                {referral.job?.company?.name || 'Company Not Available'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Updated {updatedAt}
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Middle - Status & Counterpart */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={getStatusLabel(referral.status)} 
                color={getStatusColor(referral.status)} 
                size="small"
                sx={{ mr: 1 }}
              />
              {isSeeker && (
                <Typography variant="body2" color="text.secondary">
                  {referral.status === 'pending' ? 'Awaiting response' : ''}
                  {referral.status === 'accepted' ? 'Referral in progress' : ''}
                  {referral.status === 'completed' ? 'Referral submitted' : ''}
                  {referral.status === 'rejected' ? 'Request declined' : ''}
                </Typography>
              )}
              {isReferrer && (
                <Typography variant="body2" color="text.secondary">
                  {referral.status === 'pending' ? 'Action needed' : ''}
                  {referral.status === 'accepted' ? 'Needs completion' : ''}
                  {referral.status === 'completed' ? 'Completed' : ''}
                  {referral.status === 'rejected' ? 'Declined by you' : ''}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <PersonIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={counterpart?.profileImageUrl}
                  alt={counterpart?.name || 'User'}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography variant="body2">
                  {isSeeker ? 'Referrer: ' : 'Requester: '}
                  <Typography 
                    component="span" 
                    variant="body2" 
                    fontWeight="medium"
                  >
                    {counterpart?.name || 'Unknown User'}
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        {/* Right side - Actions */}
        <Grid item xs={12} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', 
            height: '100%', 
            justifyContent: 'space-between' 
          }}>
            <Box>
              {isReferrer && referral.status === 'pending' && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Accept">
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => navigate(`/referrals/${referral.id}`)}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Decline">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => navigate(`/referrals/${referral.id}`)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowIcon />}
              onClick={handleViewDetails}
              size="small"
              sx={{ mt: 2 }}
            >
              View Details
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

ReferralItem.propTypes = {
  referral: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    seekerId: PropTypes.string.isRequired,
    referrerId: PropTypes.string.isRequired,
    seeker: PropTypes.object,
    referrer: PropTypes.object,
    job: PropTypes.shape({
      title: PropTypes.string,
      company: PropTypes.shape({
        name: PropTypes.string
      })
    })
  }).isRequired
};

export default ReferralItem; 