import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { blue, green, orange, red, purple, teal } from '@mui/material/colors';
import {
  TrendingUp,
  People,
  Business,
  Work,
  ThumbUp,
  HourglassEmpty
} from '@mui/icons-material';
import { getPlatformStats, getUserStats } from '../../store/actions/referralStatsActions';

const COLORS = [blue[500], green[500], orange[500], red[500], purple[500], teal[500]];

const StatsDashboard = () => {
  const dispatch = useDispatch();
  const { platformStats, userStats, loading, userStatsLoading } = useSelector(state => state.stats);
  
  useEffect(() => {
    dispatch(getPlatformStats());
    dispatch(getUserStats());
  }, [dispatch]);

  // Prepare chart data
  const referralStatusData = [
    { name: 'Pending', value: platformStats.pendingReferrals },
    { name: 'Accepted', value: platformStats.acceptedReferrals },
    { name: 'Successful Hires', value: platformStats.successfulHires }
  ];

  const userReferralData = [
    { name: 'Requested', value: userStats.totalReferralsRequested },
    { name: 'Given', value: userStats.totalReferralsGiven },
    { name: 'Pending', value: userStats.pendingReferrals },
    { name: 'Accepted', value: userStats.acceptedReferrals },
    { name: 'Rejected', value: userStats.rejectedReferrals },
    { name: 'Hired', value: userStats.successfulHires }
  ];

  // Statistics cards data
  const platformStatsCards = [
    { title: 'Total Users', value: platformStats.totalUsers, icon: <People color="primary" /> },
    { title: 'Total Companies', value: platformStats.totalCompanies, icon: <Business color="secondary" /> },
    { title: 'Total Jobs', value: platformStats.totalJobs, icon: <Work color="action" /> },
    { title: 'Total Referrals', value: platformStats.totalReferrals, icon: <ThumbUp color="success" /> }
  ];

  // Render loading state
  if (loading && userStatsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={3}>
      <Typography variant="h4" gutterBottom>
        Statistics Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Platform Statistics */}
      <Typography variant="h5" gutterBottom>
        Platform Overview
      </Typography>
      <Grid container spacing={3} mb={4}>
        {platformStatsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], mr: 2 }}>
                    {card.icon}
                  </Avatar>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" align="center">
                  {card.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts - Platform Referral Status */}
      <Typography variant="h5" gutterBottom>
        Referral Analytics
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Referral Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={referralStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {referralStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              User Referral Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userReferralData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={blue[500]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* User Personal Statistics */}
      <Typography variant="h5" gutterBottom>
        Your Referral Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: blue[500], mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="subtitle1">Referrals Requested</Typography>
              </Box>
              <Typography variant="h4" component="div" align="center">
                {userStats.totalReferralsRequested}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: green[500], mr: 2 }}>
                  <ThumbUp />
                </Avatar>
                <Typography variant="subtitle1">Referrals Given</Typography>
              </Box>
              <Typography variant="h4" component="div" align="center">
                {userStats.totalReferralsGiven}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: orange[500], mr: 2 }}>
                  <HourglassEmpty />
                </Avatar>
                <Typography variant="subtitle1">Pending Referrals</Typography>
              </Box>
              <Typography variant="h4" component="div" align="center">
                {userStats.pendingReferrals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: purple[500], mr: 2 }}>
                  <Work />
                </Avatar>
                <Typography variant="subtitle1">Successful Hires</Typography>
              </Box>
              <Typography variant="h4" component="div" align="center">
                {userStats.successfulHires}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDashboard; 