import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Grid,
  Divider,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { getAllReferrals } from '../store/actions/referralActions';
import ReferralItem from '../components/referrals/ReferralItem';

// TabPanel component for displaying content for each tab
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Referrals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { referrals, loading, error } = useSelector(state => state.referrals);
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    dispatch(getAllReferrals());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCreateRequest = () => {
    navigate('/referrals/new');
  };
  
  // Filter and sort referrals based on current tab and filters
  const getFilteredReferrals = () => {
    if (!referrals || !referrals.length) return [];
    
    let filtered = [...referrals];
    
    // Apply tab filtering
    if (tabValue === 0) {
      // My Requests tab (user is seeker)
      filtered = filtered.filter(ref => ref.seekerId === user.id);
    } else if (tabValue === 1) {
      // Referral Requests tab (user is referrer)
      filtered = filtered.filter(ref => ref.referrerId === user.id && ref.status !== 'completed');
    } else if (tabValue === 2) {
      // Completed tab (user is either seeker or referrer and status is completed)
      filtered = filtered.filter(ref => 
        (ref.seekerId === user.id || ref.referrerId === user.id) && 
        ref.status === 'completed'
      );
    }
    
    // Apply status filter if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ref => 
        (ref.job?.title && ref.job.title.toLowerCase().includes(searchLower)) ||
        (ref.job?.company?.name && ref.job.company.name.toLowerCase().includes(searchLower)) ||
        (ref.notes && ref.notes.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'jobTitle':
          aValue = a.job?.title || '';
          bValue = b.job?.title || '';
          break;
        case 'company':
          aValue = a.job?.company?.name || '';
          bValue = b.job?.company?.name || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
      }
      
      // For strings, use localeCompare
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // For dates or numbers
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return filtered;
  };
  
  const filteredReferrals = getFilteredReferrals();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Referrals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateRequest}
        >
          Request Referral
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="My Requests" />
          <Tab label="Referral Requests" />
          <Tab label="Completed" />
        </Tabs>
        
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="updatedAt">Last Updated</MenuItem>
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="jobTitle">Job Title</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            {filteredReferrals.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredReferrals.map(referral => (
                  <ReferralItem key={referral.id} referral={referral} />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  You haven't made any referral requests yet
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateRequest}
                  sx={{ mt: 2 }}
                >
                  Request a Referral
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {filteredReferrals.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredReferrals.map(referral => (
                  <ReferralItem key={referral.id} referral={referral} />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  You don't have any referral requests from others
                </Typography>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {filteredReferrals.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredReferrals.map(referral => (
                  <ReferralItem key={referral.id} referral={referral} />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No completed referrals yet
                </Typography>
              </Box>
            )}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default Referrals; 