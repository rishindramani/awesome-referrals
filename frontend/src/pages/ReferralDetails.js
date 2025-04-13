import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  BusinessCenter as JobIcon,
  Business as CompanyIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Work as ExperienceIcon,
  School as EducationIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HourglassEmpty as PendingIcon,
  ErrorOutline as ErrorIcon,
  AttachFile as AttachmentIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getReferralById, updateReferralStatus, addReferralNote } from '../store/actions/referralActions';

// Helper for status colors
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

// Helper for status labels
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

// Timeline step configuration
const getSteps = () => {
  return ['Request Sent', 'Request Accepted', 'Referral Submitted'];
};

// Determine active step based on status
const getActiveStep = (status) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'accepted':
      return 1;
    case 'completed':
      return 2;
    case 'rejected':
      return -1; // Special case for rejection
    default:
      return 0;
  }
};

const ReferralDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referrals, loading, error } = useSelector(state => state.referrals);
  const { user } = useSelector(state => state.auth);
  
  const [noteText, setNoteText] = useState('');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  
  useEffect(() => {
    if (id) {
      dispatch(getReferralById(id));
    }
  }, [dispatch, id]);
  
  const referral = referrals.find(r => r.id === id);
  
  // Can't render until we have the referral data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Error Loading Referral
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/referrals')}
        >
          Back to Referrals
        </Button>
      </Box>
    );
  }
  
  if (!referral) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Referral Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          The referral you're looking for doesn't exist or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/referrals')}
        >
          Back to Referrals
        </Button>
      </Box>
    );
  }
  
  // Determine if user is seeker or referrer
  const isSeeker = user.id === referral.seekerId;
  const isReferrer = user.id === referral.referrerId;
  
  // Get counterpart information
  const counterpart = isSeeker ? referral.referrer : referral.seeker;
  
  // Format dates
  const createdDate = new Date(referral.createdAt);
  const updatedDate = new Date(referral.updatedAt);
  
  // Handle status update actions
  const handleStatusUpdate = (newStatus) => {
    setAction(newStatus);
    setOpen(true);
  };
  
  const confirmStatusUpdate = () => {
    if (action) {
      dispatch(updateReferralStatus(referral.id, action));
      setOpen(false);
      setAction(null);
    }
  };
  
  const handleAddNote = () => {
    if (noteText.trim()) {
      dispatch(addReferralNote(referral.id, noteText));
      setNoteText('');
    }
  };
  
  // Get steps for this referral
  const steps = getSteps();
  const activeStep = getActiveStep(referral.status);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header with status */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              Referral Request
            </Typography>
            <Box display="flex" alignItems="center">
              <Chip 
                label={getStatusLabel(referral.status)} 
                color={getStatusColor(referral.status)} 
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Request ID: {referral.id.substring(0, 8)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Created: {format(createdDate, 'MMM dd, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last Updated: {format(updatedDate, 'MMM dd, yyyy')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Timeline */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Request Timeline
        </Typography>
        {referral.status === 'rejected' ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body1" color="error">
              This referral request was declined.
            </Typography>
            {referral.notes && referral.notes.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Reason: {referral.notes[referral.notes.length - 1].content}
              </Typography>
            )}
          </Box>
        ) : (
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}
      </Paper>
      
      <Grid container spacing={4}>
        {/* Left column - Job and Company */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Job Details" 
              avatar={<JobIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              {referral.job ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      {referral.job.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CompanyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {referral.job.company.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1">
                        {referral.job.location}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Job Description
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {referral.job.description}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Requirements
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {referral.job.requirements}
                    </Typography>
                  </Grid>
                  
                  {referral.job.applicationLink && (
                    <Grid item xs={12}>
                      <Button 
                        variant="outlined" 
                        href={referral.job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job Posting
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  Job details not available
                </Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Communication Section */}
          <Card>
            <CardHeader 
              title="Communication" 
              avatar={<CommentIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Add a note"
                  variant="outlined"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add details, questions, or updates..."
                />
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                  >
                    Add Note
                  </Button>
                </Box>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Notes & Updates
              </Typography>
              
              {referral.notes && referral.notes.length > 0 ? (
                <List>
                  {referral.notes.map((note, index) => (
                    <ListItem 
                      key={index} 
                      alignItems="flex-start"
                      sx={{ 
                        bgcolor: index % 2 === 0 ? 'background.default' : 'transparent',
                        borderRadius: 1
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          src={note.user.profileImageUrl}
                          alt={note.user.name}
                          sx={{ width: 32, height: 32 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">
                              {note.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(note.createdAt), 'MMM dd, yyyy h:mm a')}
                            </Typography>
                          </Box>
                        }
                        secondary={note.content}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No notes yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right column - User Profiles & Actions */}
        <Grid item xs={12} md={5}>
          {/* Requester Info */}
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Request Information"
              avatar={<PersonIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={referral.seeker?.profileImageUrl}
                      alt={referral.seeker?.name || 'User'}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    >
                      {referral.seeker?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {referral.seeker?.name || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Requester
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {referral.seeker?.headline && (
                  <Grid item xs={12}>
                    <Typography variant="body2" paragraph>
                      {referral.seeker.headline}
                    </Typography>
                  </Grid>
                )}
                
                {referral.seeker?.linkedin && (
                  <Grid item xs={12}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={referral.seeker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View LinkedIn Profile
                    </Button>
                  </Grid>
                )}
                
                {referral.attachments && referral.attachments.length > 0 && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Attachments
                    </Typography>
                    <List dense>
                      {referral.attachments.map((attachment, index) => (
                        <ListItem key={index} button component="a" href={attachment.url} target="_blank">
                          <ListItemIcon>
                            <AttachmentIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={attachment.name} 
                            secondary={`${attachment.type} - ${(attachment.size / 1024).toFixed(2)} KB`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
          
          {/* Referrer Info */}
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Referrer Information"
              avatar={<PersonIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              {referral.referrer ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={referral.referrer?.profileImageUrl}
                        alt={referral.referrer?.name || 'User'}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      >
                        {referral.referrer?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {referral.referrer?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Referrer
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {referral.referrer?.headline && (
                    <Grid item xs={12}>
                      <Typography variant="body2" paragraph>
                        {referral.referrer.headline}
                      </Typography>
                    </Grid>
                  )}
                  
                  {referral.referrer?.company && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CompanyIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="body2">
                          Works at {referral.referrer.company}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {referral.referrer?.position && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ExperienceIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {referral.referrer.position}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No referrer assigned yet
                </Typography>
              )}
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <Card>
            <CardHeader title="Actions" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                {isReferrer && referral.status === 'pending' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        fullWidth
                        variant="contained" 
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleStatusUpdate('accepted')}
                      >
                        Accept Request
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        fullWidth
                        variant="outlined" 
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleStatusUpdate('rejected')}
                      >
                        Decline
                      </Button>
                    </Grid>
                  </>
                )}
                
                {isReferrer && referral.status === 'accepted' && (
                  <Grid item xs={12}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      color="success"
                      startIcon={<CheckIcon />}
                      onClick={() => handleStatusUpdate('completed')}
                    >
                      Mark as Completed
                    </Button>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Button 
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/referrals')}
                  >
                    Back to Referrals
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          {action === 'accepted' && "Accept Referral Request"}
          {action === 'rejected' && "Decline Referral Request"}
          {action === 'completed' && "Complete Referral"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {action === 'accepted' && "Are you sure you want to accept this referral request? You'll be expected to submit a referral for this candidate."}
            {action === 'rejected' && "Are you sure you want to decline this referral request? This action cannot be undone."}
            {action === 'completed' && "Are you confirming that you've submitted the referral for this candidate?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmStatusUpdate} 
            color={action === 'rejected' ? 'error' : 'primary'} 
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReferralDetails; 