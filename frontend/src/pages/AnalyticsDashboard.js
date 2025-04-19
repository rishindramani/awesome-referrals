import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Alert,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  WorkOutline as JobIcon,
  ConnectWithoutContact as ReferralIcon,
  Business as CompanyIcon,
  CheckCircleOutline as SuccessIcon,
  Schedule as PendingIcon,
  BarChart as ChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Import custom components
import StatCard from '../components/stats/StatCard';
import StatChart from '../components/stats/StatChart';
import TimePeriodSelector from '../components/stats/TimePeriodSelector';

// Import actions
import { 
  getDashboardStats, 
  setStatsPeriod 
} from '../store/actions/statsActions';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

// Main Dashboard Component
const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector(state => state.auth);
  const { 
    platformStats, 
    userStats, 
    referralStats, 
    jobStats, 
    timePeriod, 
    loading, 
    error 
  } = useSelector(state => state.stats);
  
  const [tabValue, setTabValue] = useState(0);

  // Fetch stats when component mounts or time period changes
  useEffect(() => {
    dispatch(getDashboardStats(timePeriod));
  }, [dispatch, timePeriod]);

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    dispatch(setStatsPeriod(period));
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Format numbers with comma separators
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  // Format percentage
  const formatPercent = (num) => {
    return `${num || 0}%`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <TimePeriodSelector 
          value={timePeriod} 
          onChange={handleTimePeriodChange} 
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Referrals"
            value={platformStats.totalReferrals}
            icon={<ReferralIcon />}
            color="primary"
            loading={loading}
            formatValue={formatNumber}
            trend="up"
            trendValue={12}
            footer={`${platformStats.referralsThisMonth} new this month`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Referrals"
            value={platformStats.pendingReferrals}
            icon={<PendingIcon />}
            color="warning"
            loading={loading}
            formatValue={formatNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Successful Hires"
            value={platformStats.successfulHires}
            icon={<SuccessIcon />}
            color="success"
            loading={loading}
            formatValue={formatNumber}
            trend="up"
            trendValue={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={platformStats.activeUsers}
            icon={<PersonIcon />}
            color="info"
            loading={loading}
            formatValue={formatNumber}
          />
        </Grid>
      </Grid>

      {/* Tabs for different stat categories */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="My Performance" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Referrals" icon={<ReferralIcon />} iconPosition="start" />
          <Tab label="Jobs" icon={<JobIcon />} iconPosition="start" />
          <Tab label="Platform" icon={<ChartIcon />} iconPosition="start" />
        </Tabs>

        {/* Personal Stats Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Your Response Rate"
                value={userStats.responseRate}
                icon={<TimelineIcon />}
                color="success"
                loading={loading}
                formatValue={formatPercent}
                footer="Average response time: 2 days"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Referrals Given"
                value={userStats.totalReferralsGiven}
                icon={<ReferralIcon />}
                color="primary"
                loading={loading}
                formatValue={formatNumber}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Successful Hires"
                value={userStats.successfulHires}
                icon={<SuccessIcon />}
                color="success"
                loading={loading}
                formatValue={formatNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Your Referral Activity"
                type="line"
                loading={loading}
                data={[
                  { name: 'Jan', value: 4 },
                  { name: 'Feb', value: 3 },
                  { name: 'Mar', value: 5 },
                  { name: 'Apr', value: 7 },
                  { name: 'May', value: 6 },
                  { name: 'Jun', value: 8 }
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Your Referral Status"
                type="pie"
                loading={loading}
                data={[
                  { name: 'Accepted', value: userStats.acceptedReferrals },
                  { name: 'Pending', value: userStats.pendingReferrals },
                  { name: 'Rejected', value: userStats.rejectedReferrals }
                ]}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Referrals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Referrals by Status"
                type="pie"
                loading={loading}
                data={referralStats.byStatus || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Referrals by Company"
                type="bar"
                loading={loading}
                data={referralStats.byCompany || []}
              />
            </Grid>
            <Grid item xs={12}>
              <StatChart
                title="Referral Trends"
                subtitle="Monthly referral activity"
                type="line"
                loading={loading}
                data={referralStats.byTime || []}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Jobs Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Jobs by Category"
                type="pie"
                loading={loading}
                data={jobStats.byCategory || []}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Jobs by Location"
                type="bar"
                loading={loading}
                data={jobStats.byLocation || []}
              />
            </Grid>
            <Grid item xs={12}>
              <StatChart
                title="Most Requested Jobs"
                subtitle="Jobs with highest number of referral requests"
                type="bar"
                loading={loading}
                data={jobStats.mostRequested || []}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Platform Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Platform Growth"
                subtitle="User registration over time"
                type="line"
                loading={loading}
                data={[
                  { name: 'Jan', value: 65 },
                  { name: 'Feb', value: 85 },
                  { name: 'Mar', value: 110 },
                  { name: 'Apr', value: 145 },
                  { name: 'May', value: 180 },
                  { name: 'Jun', value: 210 }
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatChart
                title="Activity Breakdown"
                type="pie"
                loading={loading}
                data={[
                  { name: 'Job Views', value: 45 },
                  { name: 'Referral Requests', value: 30 },
                  { name: 'Messages', value: 15 },
                  { name: 'Profile Views', value: 10 }
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <StatChart
                title="Success Metrics"
                subtitle="Referral to hire conversion rate"
                type="bar"
                loading={loading}
                data={[
                  { name: 'Tech', requests: 100, interviews: 45, hires: 20 },
                  { name: 'Finance', requests: 80, interviews: 30, hires: 12 },
                  { name: 'Marketing', requests: 70, interviews: 35, hires: 18 },
                  { name: 'Sales', requests: 90, interviews: 50, hires: 25 },
                  { name: 'HR', requests: 50, interviews: 20, hires: 10 }
                ]}
                dataKey={['requests', 'interviews', 'hires']}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AnalyticsDashboard; 