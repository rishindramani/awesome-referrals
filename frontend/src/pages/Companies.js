import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Pagination,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Web as WebIcon
} from '@mui/icons-material';

import { getCompanies, searchCompanies } from '../store/actions/companyActions';

const CompanyCard = ({ company }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          pt: '56.25%', // 16:9 aspect ratio
          backgroundColor: 'grey.200',
          position: 'relative'
        }}
      >
        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.name}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '60%',
              maxHeight: '60%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Avatar
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'primary.main',
              width: 80,
              height: 80
            }}
          >
            <BusinessIcon sx={{ fontSize: 40 }} />
          </Avatar>
        )}
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {company.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {company.location || 'Location not specified'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WebIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {company.website || 'Website not available'}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {company.description || 'No description available'}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Button 
            component={RouterLink} 
            to={`/companies/${company.id}`} 
            variant="outlined" 
            color="primary"
            fullWidth
          >
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, loading, pagination } = useSelector(state => state.companies);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    dispatch(getCompanies(page));
  }, [dispatch, page]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchCompanies(searchTerm));
    } else {
      dispatch(getCompanies(1));
    }
    setPage(1);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    dispatch(getCompanies(1));
    setPage(1);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Companies
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore companies with open positions and find your next career opportunity.
        </Typography>
        
        {/* Search Section */}
        <Paper 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md>
              <TextField
                fullWidth
                placeholder="Search companies by name or industry..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!searchTerm.trim()}
                >
                  Search
                </Button>
                {searchTerm && (
                  <Button 
                    variant="outlined" 
                    onClick={handleClearSearch}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : companies.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <BusinessIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No companies found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {searchTerm 
                ? `No results match "${searchTerm}". Try different keywords.`
                : 'There are no companies listed yet.'}
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {companies.map(company => (
                <Grid item key={company.id} xs={12} sm={6} md={4}>
                  <CompanyCard company={company} />
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pagination.totalPages} 
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Companies; 