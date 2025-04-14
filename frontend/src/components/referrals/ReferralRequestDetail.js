import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Grid, 
  Avatar, 
  Button, 
  Chip, 
  Card, 
  CardContent,
  CardMedia,
  Link,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  ArrowBack as BackIcon,
  Work as JobIcon,
  Business as CompanyIcon,
  Description as ResumeIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

const ReferralRequestDetail = ({ 
  request, 
  loading, 
  onApprove, 
  onReject, 
  onStartChat,
  onBack 
}) => {
  if (loading || !request) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<BackIcon />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" component="h1">
          Referral Request Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Applicant Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                src={request.seeker.profile?.avatar_url}
                alt={`${request.seeker.first_name} ${request.seeker.last_name}`}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              >
                {request.seeker.first_name?.[0]}{request.seeker.last_name?.[0]}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {request.seeker.first_name} {request.seeker.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {request.seeker.profile?.current_position || 'No position specified'}
              </Typography>
              <Chip 
                label={getStatusLabel(request.status)} 
                color={getStatusColor(request.status)} 
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">{request.seeker.email}</Typography>
            </Box>
            
            {request.seeker.profile?.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{request.seeker.profile.phone}</Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Experience
            </Typography>
            <Typography variant="body2" gutterBottom>
              {request.seeker.profile?.experience_years 
                ? `${request.seeker.profile.experience_years} years of experience` 
                : 'Experience not specified'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {request.seeker.profile?.skills?.length > 0 
                ? request.seeker.profile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" />
                  ))
                : <Typography variant="body2">No skills specified</Typography>
              }
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 2 }}>
              {request.seeker.profile?.linkedin_profile && (
                <Button
                  variant="outlined"
                  startIcon={<LinkedInIcon />}
                  href={request.seeker.profile.linkedin_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  View LinkedIn Profile
                </Button>
              )}
              
              {request.resume_url && (
                <Button
                  variant="outlined"
                  startIcon={<ResumeIcon />}
                  href={request.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  View Resume
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                onClick={() => onStartChat(request.seeker.id)}
                fullWidth
              >
                Start a Conversation
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Request Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Referral Request
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={getStatusLabel(request.status)} 
                  color={getStatusColor(request.status)} 
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Requested On
                </Typography>
                <Typography variant="body1">
                  {format(new Date(request.created_at), 'MMM dd, yyyy')}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Message from Applicant
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {request.message || 'No message provided'}
            </Typography>
            
            {request.status === 'pending' && (
              <Box sx={{ display: 'flex', mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={() => onApprove(request.id)}
                  sx={{ mr: 2 }}
                >
                  Approve Request
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => onReject(request.id)}
                >
                  Reject Request
                </Button>
              </Box>
            )}
          </Paper>
          
          {/* Job Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <JobIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Job Details
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    {request.job.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CompanyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {request.job.company.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    {request.job.location}
                    {request.job.is_remote && ' (Remote)'}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={request.job.job_type} 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                    <Chip 
                      label={request.job.experience_level} 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  {request.job.application_url && (
                    <Button
                      variant="outlined"
                      color="primary"
                      href={request.job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                      View Job Posting
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Notes or additional actions could go here */}
        </Grid>
      </Grid>
    </Box>
  );
};

ReferralRequestDetail.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    seeker: PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        avatar_url: PropTypes.string,
        current_position: PropTypes.string,
        experience_years: PropTypes.number,
        skills: PropTypes.arrayOf(PropTypes.string),
        linkedin_profile: PropTypes.string,
        phone: PropTypes.string
      })
    }).isRequired,
    job: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string,
      is_remote: PropTypes.bool,
      job_type: PropTypes.string,
      experience_level: PropTypes.string,
      application_url: PropTypes.string,
      company: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
    message: PropTypes.string,
    resume_url: PropTypes.string,
    created_at: PropTypes.string.isRequired
  }),
  loading: PropTypes.bool,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onStartChat: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default ReferralRequestDetail; 