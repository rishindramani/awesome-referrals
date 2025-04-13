import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Send as SendIcon,
  Inbox as InboxIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  RemoveRedEye as ViewIcon,
  Message as MessageIcon,
  Work as WorkIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// Sample referral data
const sentReferrals = [
  {
    id: 1,
    job: {
      id: 101,
      title: 'Senior Backend Engineer',
      company: 'Google',
      logo: '/logos/google.png'
    },
    referrer: {
      id: 201,
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      title: 'Senior Software Engineer',
      company: 'Google'
    },
    message: 'I believe my 5 years of experience with cloud infrastructure and microservices make me a good fit for this role.',
    status: 'pending',
    date: '2023-06-18',
    response: null
  },
  {
    id: 2,
    job: {
      id: 102,
      title: 'Frontend Developer',
      company: 'Facebook',
      logo: '/logos/facebook.png'
    },
    referrer: {
      id: 202,
      name: 'Emily Davis',
      avatar: '/avatars/emily.jpg',
      title: 'Senior Frontend Engineer',
      company: 'Facebook'
    },
    message: 'I have extensive experience with React and would love to join your team.',
    status: 'approved',
    date: '2023-06-10',
    response: "I've submitted your referral. The recruiter should reach out within a week. Good luck!"
  },
  {
    id: 3,
    job: {
      id: 103,
      title: 'Product Manager',
      company: 'Amazon',
      logo: '/logos/amazon.png'
    },
    referrer: {
      id: 203,
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg',
      title: 'Senior Product Manager',
      company: 'Amazon'
    },
    message: 'My background in product management and e-commerce would be valuable for this role.',
    status: 'rejected',
    date: '2023-06-05',
    response: "I don't think you have enough experience for this particular role. I'd recommend applying for a more junior position first."
  }
];

const receivedReferrals = [
  {
    id: 101,
    job: {
      id: 201,
      title: 'Data Scientist',
      company: 'Microsoft',
      logo: '/logos/microsoft.png'
    },
    seeker: {
      id: 301,
      name: 'Amanda Lee',
      avatar: '/avatars/amanda.jpg',
      headline: 'Data Analyst with 3 years of experience'
    },
    message: "I have a strong background in machine learning and statistical analysis, and I'm excited about the opportunity to work at Microsoft.",
    status: 'pending',
    date: '2023-06-20'
  },
  {
    id: 102,
    job: {
      id: 202,
      title: 'DevOps Engineer',
      company: 'Google',
      logo: '/logos/google.png'
    },
    seeker: {
      id: 302,
      name: 'Robert Johnson',
      avatar: '/avatars/robert.jpg',
      headline: 'Cloud Engineer at AWS'
    },
    message: "I've been working with AWS for 4 years and would love to bring my expertise to Google Cloud.",
    status: 'approved',
    date: '2023-06-15'
  },
  {
    id: 103,
    job: {
      id: 203,
      title: 'UX Designer',
      company: 'Apple',
      logo: '/logos/apple.png'
    },
    seeker: {
      id: 303,
      name: 'Sophie Williams',
      avatar: '/avatars/sophie.jpg',
      headline: 'UI/UX Designer with focus on mobile experiences'
    },
    message: "I've always been passionate about Apple's design philosophy and would love to contribute to the team.",
    status: 'rejected',
    date: '2023-06-08'
  }
];

const ReferralRequestItem = ({ referral, type, onAction }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  const handleApprove = () => {
    onAction(referral.id, 'approve', responseMessage);
    handleDialogClose();
  };
  
  const handleReject = () => {
    onAction(referral.id, 'reject', responseMessage);
    handleDialogClose();
  };
  
  const getStatusChip = (status) => {
    let color;
    
    switch(status) {
      case 'approved':
        color = 'success';
        break;
      case 'rejected':
        color = 'error';
        break;
      default:
        color = 'warning';
    }
    
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
      />
    );
  };
  
  return (
    <>
      <ListItem sx={{ py: 2 }}>
        <ListItemAvatar>
          <Avatar 
            src={type === 'sent' ? referral.referrer.avatar : referral.seeker.avatar}
            alt={type === 'sent' ? referral.referrer.name : referral.seeker.name}
          >
            {type === 'sent' 
              ? referral.referrer.name.charAt(0) 
              : referral.seeker.name.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {type === 'sent' 
                  ? `Sent to ${referral.referrer.name}`
                  : `Request from ${referral.seeker.name}`}
              </Typography>
              {getStatusChip(referral.status)}
            </Box>
          }
          secondary={
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <WorkIcon fontSize="small" color="action" />
                <Typography variant="body2" component="span">
                  {referral.job.title} at {referral.job.company}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.5
                }}
              >
                {referral.message}
              </Typography>
              {referral.response && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1, 
                    p: 1, 
                    bgcolor: 'action.hover', 
                    borderRadius: 1
                  }}
                >
                  <strong>Response:</strong> {referral.response}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {new Date(referral.date).toLocaleDateString()}
              </Typography>
            </>
          }
          sx={{ pr: 7 }}
        />
        <ListItemSecondaryAction>
          {type === 'sent' ? (
            <IconButton edge="end" aria-label="view details">
              <ViewIcon />
            </IconButton>
          ) : (
            <>
              <IconButton 
                edge="end" 
                aria-label="options"
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDialogOpen}>
                  <ListItemIcon>
                    <MessageIcon fontSize="small" />
                  </ListItemIcon>
                  Respond
                </MenuItem>
                {referral.status === 'pending' && (
                  <>
                    <MenuItem onClick={() => onAction(referral.id, 'approve')}>
                      <ListItemIcon>
                        <CheckIcon fontSize="small" color="success" />
                      </ListItemIcon>
                      Approve
                    </MenuItem>
                    <MenuItem onClick={() => onAction(referral.id, 'reject')}>
                      <ListItemIcon>
                        <CloseIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      Reject
                    </MenuItem>
                  </>
                )}
                <MenuItem 
                  component={RouterLink} 
                  to={`/jobs/${referral.job.id}`}
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <WorkIcon fontSize="small" />
                  </ListItemIcon>
                  View Job
                </MenuItem>
              </Menu>
            </>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" />
      
      {/* Response Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Respond to {type === 'sent' ? referral.referrer.name : referral.seeker.name}'s Request
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {referral.status === 'pending' 
              ? 'Would you like to approve or reject this referral request?' 
              : 'Send a message regarding this referral request.'}
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            label="Your Response"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Provide feedback or additional information..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {referral.status === 'pending' ? (
            <>
              <Button 
                onClick={handleReject}
                color="error"
                variant="outlined"
              >
                Reject
              </Button>
              <Button 
                onClick={handleApprove}
                color="success"
                variant="contained"
              >
                Approve
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => {
                onAction(referral.id, 'respond', responseMessage);
                handleDialogClose();
              }}
              color="primary"
              variant="contained"
              disabled={!responseMessage.trim()}
            >
              Send Response
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

const ReferralRequests = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sentData, setSentData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setSentData(sentReferrals);
      setReceivedData(receivedReferrals);
      setLoading(false);
    }, 800);
    
    // In a real app, we would dispatch an action to fetch referrals
    // dispatch(fetchReferralRequests());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleReferralAction = (id, action, message = '') => {
    // In a real app, we would dispatch an action to handle the referral action
    console.log(`Referral ${id}: ${action}${message ? ` - ${message}` : ''}`);
    
    // For demo purposes, update the local state
    if (activeTab === 0) {
      // Update sent referrals
      setSentData(
        sentData.map(ref => 
          ref.id === id 
            ? { ...ref, status: action, response: message || ref.response }
            : ref
        )
      );
    } else {
      // Update received referrals
      setReceivedData(
        receivedData.map(ref => 
          ref.id === id 
            ? { ...ref, status: action }
            : ref
        )
      );
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Referral Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your sent and received referral requests
        </Typography>
      </Box>
      
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<SendIcon />} iconPosition="start" label="Sent" />
          <Tab icon={<InboxIcon />} iconPosition="start" label="Received" />
        </Tabs>
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            startIcon={<FilterListIcon />}
            size="small"
          >
            Filter
          </Button>
        </Box>
        
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {activeTab === 0 && (
              <>
                {sentData.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      No sent referral requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      You haven't sent any referral requests yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to="/jobs"
                    >
                      Browse Jobs
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {sentData.map((referral) => (
                      <ReferralRequestItem
                        key={referral.id}
                        referral={referral}
                        type="sent"
                        onAction={handleReferralAction}
                      />
                    ))}
                  </List>
                )}
              </>
            )}
            
            {activeTab === 1 && (
              <>
                {receivedData.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      No received referral requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      You haven't received any referral requests yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to="/profile"
                    >
                      Complete Your Profile
                    </Button>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {receivedData.map((referral) => (
                      <ReferralRequestItem
                        key={referral.id}
                        referral={referral}
                        type="received"
                        onAction={handleReferralAction}
                      />
                    ))}
                  </List>
                )}
              </>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ReferralRequests; 