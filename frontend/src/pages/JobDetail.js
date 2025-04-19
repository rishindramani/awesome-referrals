import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  Container,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  Description as DescriptionIcon,
  Assignment as RequirementsIcon,
  EmojiPeople as BenefitsIcon,
  LocalOffer as SkillsIcon
} from '@mui/icons-material';
import ReferralRequestForm from '../components/referrals/ReferralRequestForm';
import { useAuthContext } from '../context/AuthContext';
import { setAlert } from '../store/actions/uiActions';

// Sample job data (in a real app, this would come from an API)
const jobsData = [
  {
    id: 1,
    title: 'Senior Backend Engineer',
    company: 'Google',
    companyDescription: 'Google is a multinational technology company specializing in Internet-related services and products, including online advertising technologies, a search engine, cloud computing, software, and hardware.',
    location: 'Mountain View, CA',
    salary: '$150K - $180K',
    type: 'Full-time',
    posted: '3 days ago',
    deadline: '2023-07-15',
    logo: '/logos/google.png',
    skills: ['Python', 'Java', 'AWS', 'Kubernetes', 'Microservices', 'Docker', 'CI/CD', 'REST APIs'],
    description: 'We are looking for a senior backend engineer to join our cloud infrastructure team. You will be responsible for designing, building, and maintaining our core services that power Google products used by billions of people worldwide.',
    responsibilities: [
      'Design and develop scalable backend services',
      'Write clean, maintainable, and efficient code',
      'Collaborate with cross-functional teams to define and implement new features',
      'Troubleshoot and resolve complex issues in production environments',
      'Participate in code reviews and mentor junior engineers',
      'Contribute to technical documentation'
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field, or equivalent practical experience",
      "5+ years of experience in backend development",
      "Strong proficiency in at least one of the following: Python, Java, or Go",
      "Experience with cloud services (AWS, GCP, or Azure)",
      "Knowledge of containerization technologies (Docker, Kubernetes)",
      "Experience with database design and optimization",
      "Strong problem-solving skills and attention to detail"
    ],
    benefits: [
      'Competitive salary and equity',
      'Comprehensive health, dental, and vision insurance',
      'Generous paid time off and flexible work arrangements',
      'Professional development opportunities and education reimbursement',
      '401(k) plan with company match',
      'Free meals and snacks',
      'Gym and wellness programs'
    ],
    potentialReferrers: [
      {
        id: 101,
        name: 'John Smith',
        title: 'Senior Software Engineer',
        company: 'Google',
        connections: 2,
        success_rate: 85,
        avatar: '/avatars/john.jpg'
      },
      {
        id: 102,
        name: 'Sarah Johnson',
        title: 'Engineering Manager',
        company: 'Google',
        connections: 1,
        success_rate: 92,
        avatar: '/avatars/sarah.jpg'
      },
      {
        id: 103,
        name: 'Michael Chen',
        title: 'Staff Software Engineer',
        company: 'Google',
        connections: 3,
        success_rate: 78,
        avatar: '/avatars/michael.jpg'
      }
    ]
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Facebook',
    companyDescription: 'Facebook is a social media and technology company that builds products to enable people to connect and share with friends and family.',
    location: 'Remote',
    salary: '$120K - $150K',
    type: 'Full-time',
    posted: '1 week ago',
    deadline: '2023-07-30',
    logo: '/logos/facebook.png',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML5', 'Redux', 'Jest', 'Webpack'],
    description: 'Join our team to build responsive and performant web applications that connect billions of people around the world. You will work on innovative features and collaborate with designers, product managers, and other engineers to create exceptional user experiences.',
    responsibilities: [
      'Develop new user-facing features using React and related technologies',
      'Build reusable components and libraries for future use',
      'Optimize applications for maximum speed and scalability',
      'Collaborate with backend developers to integrate frontend with services',
      'Implement responsive design and ensure cross-browser compatibility',
      'Participate in the full development lifecycle, including requirements gathering and testing'
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field, or equivalent practical experience",
      "3+ years of experience with frontend development",
      "Proficiency in React, JavaScript/TypeScript, and modern frontend frameworks",
      "Strong understanding of responsive design principles",
      "Experience with state management (Redux, Context API)",
      "Familiarity with testing frameworks such as Jest",
      "Understanding of browser rendering and performance optimization"
    ],
    benefits: [
      'Competitive salary and equity package',
      'Comprehensive health, dental, and vision insurance',
      'Flexible work arrangements and generous time off',
      'Professional development budget',
      '401(k) with company match',
      'Parental leave and family planning benefits',
      'Wellness programs and fitness stipend'
    ],
    potentialReferrers: [
      {
        id: 201,
        name: 'Emily Davis',
        title: 'Senior Frontend Engineer',
        company: 'Facebook',
        connections: 1,
        success_rate: 90,
        avatar: '/avatars/emily.jpg'
      },
      {
        id: 202,
        name: 'David Wilson',
        title: 'Product Engineer',
        company: 'Facebook',
        connections: 2,
        success_rate: 82,
        avatar: '/avatars/david.jpg'
      }
    ]
  }
];

// Job detail component
const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReferrer, setSelectedReferrer] = useState(null);
  const [showReferralForm, setShowReferralForm] = useState(false);
  
  // In a real app, we would fetch job details from an API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundJob = jobsData.find(j => j.id === parseInt(id));
      setJob(foundJob);
      setLoading(false);
    }, 800);
    
    // Example of how we would dispatch an action
    // dispatch(fetchJobDetails(id));
  }, [id, dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const toggleSaved = () => {
    setSaved(!saved);
    // In a real app, we would dispatch an action to save/unsave the job
    // dispatch(saveJob(id, !saved));
  };
  
  const handleReferralRequest = (referrer) => {
    if (!user) {
      dispatch(setAlert('Please log in to request a referral', 'error'));
      navigate('/login');
      return;
    }
    
    setSelectedReferrer(referrer);
    setShowReferralForm(true);
  };
  
  const handleCloseReferralForm = () => {
    setShowReferralForm(false);
    setSelectedReferrer(null);
  };
  
  const handleReferralSuccess = () => {
    dispatch(setAlert('Your referral request has been sent successfully!', 'success'));
    setShowReferralForm(false);
    setSelectedReferrer(null);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!job) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Job not found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The job you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={RouterLink}
            to="/jobs"
            startIcon={<ArrowBackIcon />}
          >
            Back to Jobs
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Jobs
        </Button>
      </Box>
      
      {/* Job Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={job.logo}
                alt={job.company}
                sx={{ width: 64, height: 64, mr: 2, bgcolor: 'background.paper' }}
              >
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {job.company}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {job.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SalaryIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {job.salary}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {job.type}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => {
                  // Scroll to referrers section
                  document.getElementById('referrers-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                Find Referrers
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={saved ? <StarIcon /> : <StarBorderIcon />}
                  onClick={toggleSaved}
                  fullWidth
                >
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<ShareIcon />}
                  fullWidth
                >
                  Share
                </Button>
              </Box>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Posted {job.posted} • Apply before {new Date(job.deadline).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Job Details Tabs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<DescriptionIcon />} iconPosition="start" label="Overview" />
              <Tab icon={<RequirementsIcon />} iconPosition="start" label="Requirements" />
              <Tab icon={<BenefitsIcon />} iconPosition="start" label="Benefits" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              {activeTab === 0 && (
                <>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    About the Role
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {job.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Key Responsibilities
                  </Typography>
                  <List dense>
                    {job.responsibilities.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ mt: 2 }}>
                    About {job.company}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {job.companyDescription}
                  </Typography>
                </>
              )}
              
              {/* Requirements Tab */}
              {activeTab === 1 && (
                <>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Qualifications & Requirements
                  </Typography>
                  <List dense>
                    {job.requirements.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="h6" gutterBottom fontWeight="medium" sx={{ mt: 3 }}>
                    Skills & Expertise
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="medium"
                        icon={<SkillsIcon />}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </>
              )}
              
              {/* Benefits Tab */}
              {activeTab === 2 && (
                <>
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Benefits & Perks
                  </Typography>
                  <List dense>
                    {job.benefits.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Potential Referrers */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.light', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
              <Typography variant="h6" fontWeight="medium">
                Potential Referrers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with employees who can refer you
              </Typography>
            </Box>
            <Divider />
            
            <List sx={{ py: 0 }}>
              {job.potentialReferrers.map((referrer, index) => (
                <React.Fragment key={referrer.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Avatar src={referrer.avatar} alt={referrer.name}>
                        {referrer.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {referrer.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" display="block">
                            {referrer.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Chip 
                              label={`${referrer.success_rate}% Success`} 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {referrer.connections} connection{referrer.connections !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < job.potentialReferrers.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                component={RouterLink}
                to="/network"
              >
                View All Connections
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Referral Request Form Dialog */}
      <Dialog
        open={showReferralForm}
        onClose={handleCloseReferralForm}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedReferrer && job && (
            <ReferralRequestForm
              jobId={job.id.toString()}
              referrerId={selectedReferrer.id.toString()}
              companyName={job.company}
              jobTitle={job.title}
              onSuccess={handleReferralSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Potential Referrers Section */}
      <Box id="referrers-section" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Potential Referrers
        </Typography>
        <Typography variant="body1" paragraph>
          Connect with employees who can refer you to this position
        </Typography>
        
        <Grid container spacing={2}>
          {job.potentialReferrers.map((referrer) => (
            <Grid item xs={12} sm={6} md={4} key={referrer.id}>
              <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={referrer.avatar} alt={referrer.name} sx={{ mr: 2 }}>
                    {referrer.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {referrer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {referrer.title}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    component={RouterLink}
                    to={`/referrals/new/${job.id}/${referrer.id}`}
                  >
                    Request Referral
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default JobDetail; 