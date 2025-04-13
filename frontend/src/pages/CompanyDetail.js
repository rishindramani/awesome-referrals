import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
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
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Info as InfoIcon,
  Assessment as AssessmentIcon,
  Public as PublicIcon
} from '@mui/icons-material';

import { getCompanyById } from '../store/actions/companyActions';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CompanyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { company, detailLoading } = useSelector(state => state.companies);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(getCompanyById(id));
  }, [dispatch, id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (detailLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!company) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Company not found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The company you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={RouterLink}
            to="/companies"
            startIcon={<ArrowBackIcon />}
          >
            Back to Companies
          </Button>
        </Box>
      </Container>
    );
  }
  
  const renderCompanyOverview = () => (
    <>
      <Typography variant="h6" gutterBottom>
        About {company.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {company.description || 'No company description available.'}
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Company Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Industry"
                    secondary={company.industry || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Headquarters"
                    secondary={company.location || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WebIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Website"
                    secondary={
                      company.website ? (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {company.website}
                        </a>
                      ) : (
                        'Not available'
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Company Size"
                    secondary={company.size || 'Not specified'}
                  />
                </ListItem>
                {company.founded && (
                  <ListItem>
                    <ListItemIcon>
                      <PublicIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Founded"
                      secondary={company.founded}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Company Culture & Benefits
              </Typography>
              {company.benefits && company.benefits.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {company.benefits.map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Benefits information not available.
                </Typography>
              )}
              
              {company.culture && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                    Company Culture
                  </Typography>
                  <Typography variant="body2">
                    {company.culture}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
  
  const renderOpenPositions = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Open Positions at {company.name}
      </Typography>
      
      {company.jobs && company.jobs.length > 0 ? (
        <Grid container spacing={3}>
          {company.jobs.map(job => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {job.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                    <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {job.location || 'Remote'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={job.type || 'Full-time'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Button
                    component={RouterLink}
                    to={`/jobs/${job.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No open positions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            There are currently no job openings at {company.name}.
          </Typography>
        </Paper>
      )}
    </>
  );
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/companies"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {company.logo_url ? (
              <Avatar
                src={company.logo_url}
                alt={company.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
            ) : (
              <Avatar
                sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
              >
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" component="h1">
                {company.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {company.industry || 'Company'} • {company.location || 'Location not specified'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="company detail tabs"
          >
            <Tab 
              icon={<InfoIcon />} 
              label="Overview" 
              id="company-tab-0" 
              aria-controls="company-tabpanel-0" 
            />
            <Tab 
              icon={<WorkIcon />} 
              label="Open Positions" 
              id="company-tab-1" 
              aria-controls="company-tabpanel-1" 
            />
            <Tab 
              icon={<AssessmentIcon />} 
              label="Statistics" 
              id="company-tab-2" 
              aria-controls="company-tabpanel-2" 
            />
          </Tabs>
        </Box>
        
        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {renderCompanyOverview()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderOpenPositions()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Company Statistics
          </Typography>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Statistics for {company.name} will be available soon.
            </Typography>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default CompanyDetail; 