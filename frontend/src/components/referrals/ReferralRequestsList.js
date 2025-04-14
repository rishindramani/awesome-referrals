import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Chip,
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  OpenInNew as ViewIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../common/EmptyState';

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

const ReferralRequestsList = ({ 
  requests, 
  loading, 
  onApprove, 
  onReject, 
  onViewDetails 
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        title="No referral requests"
        description="When job seekers request referrals from you, they will appear here"
        icon="people"
      />
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
      {requests.map((request) => (
        <Paper 
          key={request.id} 
          elevation={1} 
          sx={{ mb: 2, overflow: 'hidden' }}
        >
          <ListItem
            alignItems="flex-start"
            sx={{ py: 2 }}
            secondaryAction={
              request.status === 'pending' && (
                <Box>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<ApproveIcon />}
                    onClick={() => onApprove(request.id)}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<RejectIcon />}
                    onClick={() => onReject(request.id)}
                  >
                    Reject
                  </Button>
                </Box>
              )
            }
          >
            <ListItemAvatar>
              <Avatar 
                src={request.seeker.profile?.avatar_url} 
                alt={`${request.seeker.first_name} ${request.seeker.last_name}`}
              >
                {request.seeker.first_name?.[0]}{request.seeker.last_name?.[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="span">
                  {request.seeker.first_name} {request.seeker.last_name}
                </Typography>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Referral for {request.job.title} at {request.job.company.name}
                  </Typography>
                  <Typography
                    component="div"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Chip 
                          label={getStatusLabel(request.status)} 
                          color={getStatusColor(request.status)} 
                          size="small" 
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider />
          <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
            <Typography variant="body2" gutterBottom>
              {request.message?.length > 150 
                ? `${request.message.substring(0, 150)}...` 
                : request.message}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Box>
                {request.seeker.profile?.linkedin_profile && (
                  <Button 
                    size="small" 
                    variant="text" 
                    href={request.seeker.profile.linkedin_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<PersonIcon />}
                    sx={{ mr: 1 }}
                  >
                    LinkedIn
                  </Button>
                )}
                {request.resume_url && (
                  <Button 
                    size="small" 
                    variant="text"
                    href={request.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </Button>
                )}
              </Box>
              <Button
                size="small"
                variant="text"
                onClick={() => onViewDetails(request.id)}
                endIcon={<ViewIcon />}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </List>
  );
};

ReferralRequestsList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      seeker: PropTypes.shape({
        id: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        profile: PropTypes.shape({
          avatar_url: PropTypes.string,
          linkedin_profile: PropTypes.string
        })
      }).isRequired,
      job: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        company: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
      message: PropTypes.string,
      resume_url: PropTypes.string,
      created_at: PropTypes.string.isRequired
    })
  ),
  loading: PropTypes.bool,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default ReferralRequestsList; 