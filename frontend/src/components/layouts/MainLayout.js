import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Button,
  Badge,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  WorkOutline as JobIcon,
  Person as PersonIcon,
  SwapHoriz as ReferralIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import { toggleSidebar, toggleNotificationPanel } from '../../store/actions/uiActions';
import { logout } from '../../store/actions/authActions';
import AlertMessage from '../common/AlertMessage';
import NotificationPanel from '../notifications/NotificationPanel';

const drawerWidth = 240;

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sidebarOpen, alerts } = useSelector(state => state.ui);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };
  
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/', auth: false },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', auth: true },
    { text: 'Job Search', icon: <JobIcon />, path: '/jobs', auth: true },
    { text: 'Companies', icon: <BusinessIcon />, path: '/companies', auth: true },
    { text: 'Referrals', icon: <ReferralIcon />, path: '/referrals', auth: true },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile', auth: true }
  ];
  
  const drawer = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: [1]
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Awesome Referrals
        </Typography>
        {isMobile && (
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          (!item.auth || (item.auth && isAuthenticated)) && (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? () => dispatch(toggleSidebar()) : undefined}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
    </>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Alerts */}
      <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
        {alerts.map(alert => (
          <AlertMessage key={alert.id} alert={alert} />
        ))}
      </Box>
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
        color="default"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold'
          }}>
            Awesome Referrals
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={() => dispatch(toggleNotificationPanel())}>
                <Badge badgeContent={user?.unreadNotifications || 0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton 
                edge="end" 
                color="inherit" 
                aria-label="account"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar
                  alt={user?.first_name}
                  src={user?.profile_picture_url}
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.first_name?.charAt(0)}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button 
                color="primary" 
                variant="contained" 
                component={Link} 
                to="/register"
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Notification Panel */}
      <NotificationPanel />
      
      {/* Sidebar / Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth 
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 