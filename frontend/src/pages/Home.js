import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  BusinessCenter as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          pt: 8,
          pb: 10,
          borderRadius: '0 0 20px 20px',
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Get Referred to Your Dream Job
              </Typography>
              <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                Connect with employees at your target companies and boost your chances of getting hired through personal referrals.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<SearchIcon />}
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    borderColor: 'white'
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <img 
                src="/hero-image.svg" 
                alt="Job referrals illustration" 
                style={{ 
                  width: '100%', 
                  maxHeight: '400px',
                  filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04))'
                }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            How It Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Awesome Referrals simplifies the job referral process in just three easy steps.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    p: 2, 
                    borderRadius: '50%',
                    mb: 2
                  }}
                >
                  <SearchIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Search Jobs
                </Typography>
                <Typography color="text.secondary">
                  Browse through our extensive collection of job listings from top companies. Filter by location, role, and experience level.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    p: 2, 
                    borderRadius: '50%',
                    mb: 2
                  }}
                >
                  <PeopleIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Connect with Referrers
                </Typography>
                <Typography color="text.secondary">
                  Find employees at your target companies who can refer you. Our platform matches you with the right referrers.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    p: 2, 
                    borderRadius: '50%',
                    mb: 2
                  }}
                >
                  <BusinessIcon fontSize="large" color="primary" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Get Referred
                </Typography>
                <Typography color="text.secondary">
                  Request a referral and increase your chances of getting hired. Track the status of your referral requests in real time.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Features
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Awesome Referrals offers comprehensive tools to streamline your job search and referral process.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/job-board.jpg"
                  alt="Job board"
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Integrated Job Board
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Seamlessly browse through thousands of job listings from Naukri.com and find opportunities that match your skills and preferences.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/analytics.jpg"
                  alt="Analytics"
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Comprehensive Analytics
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Track your application progress, view referral success rates, and gain insights into your job search journey with detailed analytics.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/verification.jpg"
                  alt="Verification"
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    LinkedIn Verification
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Build trust with our LinkedIn verification system, ensuring that both job seekers and referrers have authenticated profiles.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/rewards.jpg"
                  alt="Rewards"
                />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    Reward System
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Incentivize referrals with our points-based reward system. Earn points for successful referrals and redeem them for exciting rewards.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Success Stories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Hear from job seekers who found their dream jobs through Awesome Referrals.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "I had been applying to jobs for months without success. Through Awesome Referrals, I connected with an employee at my dream company and received a referral. I got an interview within a week and now I work there!"
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  RK
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Rahul Kumar</Typography>
                  <Typography variant="body2" color="text.secondary">Software Engineer at Google</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "As a referrer, I've helped five people get jobs at my company. The platform makes it easy to review candidates and submit referrals. Plus, the reward points are a nice bonus!"
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  PS
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Priya Sharma</Typography>
                  <Typography variant="body2" color="text.secondary">Product Manager at Microsoft</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "The analytics dashboard helped me understand where I was going wrong with my applications. After tweaking my approach based on the insights, I secured a referral and got hired within a month!"
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    mr: 2
                  }}
                >
                  AP
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Arjun Patel</Typography>
                  <Typography variant="body2" color="text.secondary">Data Scientist at Amazon</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: '20px',
          mb: 8
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
              Ready to Get Referred?
            </Typography>
            <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Join Awesome Referrals today and increase your chances of landing your dream job through personal referrals.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ 
                px: 6, 
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold'
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" component="div" color="primary" fontWeight="bold">
                10,000+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Job Listings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" component="div" color="primary" fontWeight="bold">
                5,000+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Successful Referrals
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" component="div" color="primary" fontWeight="bold">
                2,500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Hires Made
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h2" component="div" color="primary" fontWeight="bold">
                85%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Interview Success Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 