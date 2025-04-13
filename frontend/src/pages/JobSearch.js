import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Stack,
  Typography,
  CircularProgress,
  Avatar,
  TextField
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Business as BusinessIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// Sample job data
const jobsData = [
  {
    id: 1,
    title: 'Senior Backend Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$150K - $180K',
    type: 'Full-time',
    posted: '3 days ago',
    logo: '/logos/google.png',
    skills: ['Python', 'Java', 'AWS', 'Kubernetes'],
    description: 'We are looking for a senior backend engineer to join our cloud infrastructure team...'
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Facebook',
    location: 'Remote',
    salary: '$120K - $150K',
    type: 'Full-time',
    posted: '1 week ago',
    logo: '/logos/facebook.png',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    description: 'Join our team to build responsive and performant web applications...'
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '$130K - $160K',
    type: 'Full-time',
    posted: '2 days ago',
    logo: '/logos/amazon.png',
    skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis'],
    description: 'Help us analyze and interpret complex data to drive business decisions...'
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$110K - $140K',
    type: 'Full-time',
    posted: '5 days ago',
    logo: '/logos/apple.png',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
    description: 'Design beautiful and intuitive interfaces for our products...'
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    salary: '$125K - $155K',
    type: 'Full-time',
    posted: '1 day ago',
    logo: '/logos/microsoft.png',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    description: 'Build and maintain our cloud infrastructure and deployment pipelines...'
  },
  {
    id: 6,
    title: 'Product Manager',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$140K - $170K',
    type: 'Full-time',
    posted: '4 days ago',
    logo: '/logos/netflix.png',
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
    description: 'Lead the development of new features for our streaming service...'
  },
  {
    id: 7,
    title: 'Mobile Developer (iOS)',
    company: 'Spotify',
    location: 'New York, NY',
    salary: '$115K - $145K',
    type: 'Full-time',
    posted: '6 days ago',
    logo: '/logos/spotify.png',
    skills: ['Swift', 'iOS', 'Mobile Development', 'UI Design'],
    description: 'Develop and enhance our iOS application to deliver an amazing user experience...'
  }
];

// Job listing card component
const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);
  
  const toggleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };
  
  return (
    <Card 
      component={RouterLink} 
      to={`/jobs/${job.id}`}
      sx={{ 
        display: 'block', 
        textDecoration: 'none', 
        color: 'inherit',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        },
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={job.logo}
              alt={job.company}
              sx={{ width: 50, height: 50, mr: 2, bgcolor: 'background.paper' }}
            >
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" fontWeight="bold">
                {job.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {job.company}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={toggleSaved}
            aria-label={saved ? "Unsave job" : "Save job"}
            sx={{ color: saved ? 'warning.main' : 'action.disabled' }}
          >
            {saved ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <SalaryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.salary}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.type} • Posted {job.posted}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {job.description}
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {job.skills.slice(0, 3).map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
          {job.skills.length > 3 && (
            <Chip
              label={`+${job.skills.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
        </Stack>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Here we would handle the request for referral action
            }}
          >
            Request Referral
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const JobSearch = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobsData);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;
  
  // In a real implementation, we would fetch jobs from an API
  useEffect(() => {
    // Simulating API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    
    // Example of how we would dispatch an action to fetch jobs
    // dispatch(fetchJobs({ searchTerm, location, jobType, experienceLevel }));
  }, [dispatch]);
  
  // Handle search and filtering
  useEffect(() => {
    let results = jobsData;
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (location) {
      results = results.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (jobType) {
      results = results.filter(job => 
        job.type.toLowerCase() === jobType.toLowerCase()
      );
    }
    
    setFilteredJobs(results);
    setPage(1); // Reset to first page on new search
  }, [searchTerm, location, jobType, experienceLevel]);
  
  // Pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  
  const resetFilters = () => {
    setSearchTerm('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse job listings to find your next opportunity and request referrals
        </Typography>
      </Box>
      
      {/* Search and Filter Section */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="search-input">Search Jobs</InputLabel>
              <OutlinedInput
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                label="Search Jobs"
                placeholder="Job title, company, or skills"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select
                labelId="job-type-label"
                id="job-type"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                label="Job Type"
                startAdornment={
                  <InputAdornment position="start">
                    <WorkIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            startIcon={<FilterListIcon />}
            onClick={resetFilters}
            disabled={!searchTerm && !location && !jobType && !experienceLevel}
          >
            Reset Filters
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </Paper>
      
      {/* Results Section */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {filteredJobs.length} Jobs Found
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <Select
            value="relevance"
            displayEmpty
          >
            <MenuItem value="relevance">Sort by: Relevance</MenuItem>
            <MenuItem value="recent">Sort by: Most Recent</MenuItem>
            <MenuItem value="salary_high">Sort by: Salary (High to Low)</MenuItem>
            <MenuItem value="salary_low">Sort by: Salary (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <Typography variant="h6" gutterBottom>
            No jobs found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or browse all available jobs
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={resetFilters}
          >
            View All Jobs
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {currentJobs.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default JobSearch; 