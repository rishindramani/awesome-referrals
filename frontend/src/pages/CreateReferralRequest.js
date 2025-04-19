import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useAuthContext } from '../context/AuthContext';
import { setAlert } from '../store/actions/uiActions';
import ReferralRequestForm from '../components/referrals/ReferralRequestForm';
import apiService from '../services/apiService';

const CreateReferralRequest = () => {
  const { jobId, referrerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [referrer, setReferrer] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch job and referrer details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const jobResponse = await apiService.jobs.getById(jobId);
        setJob(jobResponse.data.data.job);
        
        // Fetch referrer profile
        const referrerResponse = await apiService.users.getProfileByUsername(referrerId);
        setReferrer(referrerResponse.data.data.user);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load job or referrer details';
        setError(errorMessage);
        dispatch(setAlert(errorMessage, 'error'));
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, referrerId, dispatch]);
  
  const handleReferralSuccess = () => {
    dispatch(setAlert('Referral request sent successfully!', 'success'));
    
    // Redirect to referrals page after a short delay
    setTimeout(() => {
      navigate('/referrals');
    }, 1500);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/jobs"
        >
          Back to Jobs
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/jobs" color="inherit">
          Jobs
        </Link>
        <Link component={RouterLink} to={`/jobs/${jobId}`} color="inherit">
          Job Details
        </Link>
        <Typography color="text.primary">Request Referral</Typography>
      </Breadcrumbs>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to={`/jobs/${jobId}`}
          sx={{ mr: 2 }}
        >
          Back to Job
        </Button>
        <Typography variant="h4">Request a Referral</Typography>
      </Box>
      
      {/* Job Card */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={job?.company?.logo_url}
                alt={job?.company?.name}
                sx={{ width: 60, height: 60, mr: 2 }}
              >
                {job?.company?.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h5">{job?.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {job?.company?.name}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{job?.location || 'Location not specified'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{job?.job_type || 'Job type not specified'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">{job?.experience_level || 'Experience not specified'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Posted {job?.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'recently'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Referrer Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Referrer
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={referrer?.profile_picture_url}
                alt={`${referrer?.first_name} ${referrer?.last_name}`}
                sx={{ width: 50, height: 50, mr: 2 }}
              >
                {referrer?.first_name?.[0]}{referrer?.last_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {referrer?.first_name} {referrer?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {referrer?.profile?.current_position || 'Position not specified'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  at {job?.company?.name}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Referral Request Form */}
      <ReferralRequestForm
        jobId={jobId}
        referrerId={referrerId}
        companyName={job?.company?.name}
        jobTitle={job?.title}
        onSuccess={handleReferralSuccess}
      />
    </Container>
  );
};

export default CreateReferralRequest; 