import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TablePagination,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { getReferralRequests } from '../../store/actions/referralActions';
import ReferralItem from './ReferralItem';
import EmptyState from '../common/EmptyState';

const statusColors = {
  pending: 'warning',
  accepted: 'info',
  rejected: 'error',
  completed: 'success'
};

const ReferralList = () => {
  const dispatch = useDispatch();
  const { referralRequests, loading, total } = useSelector(state => state.referrals);
  const { user } = useSelector(state => state.auth);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  
  useEffect(() => {
    dispatch(getReferralRequests({
      page: page + 1, 
      limit: rowsPerPage,
      status: statusFilter || undefined
    }));
  }, [dispatch, page, rowsPerPage, statusFilter]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  if (loading && referralRequests.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (referralRequests.length === 0) {
    return (
      <EmptyState 
        title="No referral requests found"
        description={
          user.role === 'seeker' 
            ? "You haven't requested any referrals yet. Find a job and request a referral to get started." 
            : "You don't have any referral requests yet. Job seekers will appear here when they request your help."
        }
        actionText={user.role === 'seeker' ? "Find Jobs" : null}
        actionLink={user.role === 'seeker' ? "/jobs" : null}
      />
    );
  }
  
  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" component="h2">
          {user.role === 'seeker' ? 'My Referral Requests' : 'Referral Requests'}
        </Typography>
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Paper>
        <TableContainer>
          <Table aria-label="referral requests table">
            <TableHead>
              <TableRow>
                <TableCell>Job</TableCell>
                <TableCell>{user.role === 'seeker' ? 'Referrer' : 'Seeker'}</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {referralRequests.map((referral) => (
                <ReferralItem key={referral.id} referral={referral} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default ReferralList; 