import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import {
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  SwapHoriz as SwapIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

// Placeholder data for initial development
const recentReferrals = [
  {
    id: 1,
    job: 'Frontend Developer',
    company: 'Google',
    date: '2023-06-15',
    status: 'pending'
  },
  {
    id: 2,
    job: 'Data Scientist',
    company: 'Microsoft',
    date: '2023-06-10',
    status: 'approved'
  },
  {
    id: 3,
    job: 'Product Manager',
    company: 'Amazon',
    date: '2023-06-05',
    status: 'rejected'
  }
];

const recentJobs = [
  {
    id: 101,
    title: 'Senior Backend Engineer',
    company: 'Netflix',
    location: 'Remote',
    posted: '2 days ago',
    logo: '/logos/netflix.png'
  },
  {
    id: 102,
    title: 'UX/UI Designer',
    company: 'Spotify',
    location: 'New York, NY',
    posted: '3 days ago',
    logo: '/logos/spotify.png'
  },
  {
    id: 103,
    title: 'Data Analyst',
    company: 'IBM',
    location: 'Austin, TX',
    posted: '1 week ago',
    logo: '/logos/ibm.png'
  }
];

// Component for displaying statistics
const StatCard = ({ icon, value, label, color }) => (
  <Card sx={{ height: '100%', borderRadius: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  
  // In a real implementation, we would fetch dashboard data here
  useEffect(() => {
    // dispatch(fetchDashboardData());
  }, [dispatch]);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.first_name || 'User'}! Here's what's happening with your referrals.
        </Typography>
      </Box>
      
      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<WorkIcon />} 
            value="12" 
            label="Applied Jobs" 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<SwapIcon />} 
            value="5" 
            label="Referral Requests" 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<VisibilityIcon />} 
            value="24" 
            label="Profile Views" 
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<CheckCircleIcon />} 
            value="3" 
            label="Interviews" 
            color="success"
          />
        </Grid>
      </Grid>
      
      {/* Main Dashboard Content */}
      <Grid container spacing={4}>
        {/* Recent Referrals */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            <CardHeader
              title="Recent Referral Requests"
              action={
                <Button
                  component={RouterLink}
                  to="/referrals"
                  endIcon={<TrendingUpIcon />}
                  color="primary"
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {recentReferrals.map((referral) => (
                <React.Fragment key={referral.id}>
                  <ListItem sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <SwapIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {referral.job} at {referral.company}
                        </Typography>
                      }
                      secondary={`Requested on ${new Date(referral.date).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={referral.status}
                        color={
                          referral.status === 'approved' 
                            ? 'success' 
                            : referral.status === 'rejected' 
                              ? 'error' 
                              : 'warning'
                        }
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/jobs"
                startIcon={<SearchIcon />}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Find More Jobs to Request Referrals
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Jobs */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            <CardHeader
              title="Recent Job Postings"
              action={
                <Button
                  component={RouterLink}
                  to="/jobs"
                  endIcon={<SearchIcon />}
                  color="primary"
                >
                  View All
                </Button>
              }
            />
            <Divider />
            <List sx={{ p: 0 }}>
              {recentJobs.map((job) => (
                <React.Fragment key={job.id}>
                  <ListItem 
                    button 
                    component={RouterLink} 
                    to={`/jobs/${job.id}`}
                    sx={{ px: 3, py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        src={job.logo} 
                        alt={job.company}
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        <WorkIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {job.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          {job.company} • {job.location} • {job.posted}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="more options">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/jobs"
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                fullWidth
              >
                Explore All Jobs
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: 'primary.light', 
              border: '1px solid rgba(0,0,0,0.08)' 
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Button
                  component={RouterLink}
                  to="/profile"
                  variant="contained"
                  color="primary"
                  startIcon={<Avatar sx={{ width: 24, height: 24 }}>U</Avatar>}
                  fullWidth
                  sx={{ py: 1, textTransform: 'none' }}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  component={RouterLink}
                  to="/jobs"
                  variant="outlined"
                  color="primary"
                  startIcon={<SearchIcon />}
                  fullWidth
                  sx={{ py: 1, textTransform: 'none', bgcolor: 'background.paper' }}
                >
                  Find Jobs
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  component={RouterLink}
                  to="/referrals"
                  variant="outlined"
                  color="primary"
                  startIcon={<SwapIcon />}
                  fullWidth
                  sx={{ py: 1, textTransform: 'none', bgcolor: 'background.paper' }}
                >
                  Manage Referrals
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  component={RouterLink}
                  to="/messages"
                  variant="outlined"
                  color="primary"
                  startIcon={<QuestionAnswerIcon />}
                  fullWidth
                  sx={{ py: 1, textTransform: 'none', bgcolor: 'background.paper' }}
                >
                  Messages
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 