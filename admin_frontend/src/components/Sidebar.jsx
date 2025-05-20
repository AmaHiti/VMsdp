import './Sidebar.css';

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment'; // For reports
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // For reservations list
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'; // For reservations
import { assets } from '../assest/assest';

const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [orderSubmenu, setOrderSubmenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleOrderSubmenu = () => {
    setOrderSubmenu(!orderSubmenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Updated menu items with appropriate icons
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    { 
      text: 'Add Reservations Tables', 
      icon: <TableRestaurantIcon />, 
      path: '/add-table' 
    },
    { 
      text: 'All Orders', 
      icon: <ListAltIcon />, 
      path: '/orders' 
    },
    { 
      text: 'List Reservations', 
      icon: <EventAvailableIcon />, 
      path: '/reservations' 
    },
    {
      text: 'All Users',
      icon: <AssessmentIcon />,
      path: '/all-users'
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Tour Management
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" size="large">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" size="large" sx={{ ml: 1 }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={toggleDrawer}
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundImage: 'linear-gradient(180deg, #2A3F54 0%, #1A2A38 100%)',
            color: 'white',
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Toolbar sx={{ display: isMobile ? 'block' : 'none' }} />
        
        {/* Brand and profile section */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
            Admin System
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', my: 2 }}>
            <Avatar
              src={assets.profile}
              alt="Profile Picture"
              sx={{ 
                width: 100, 
                height: 100,
                border: '3px solid #fff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              Sanjeeewa
            </Typography>
            <Typography variant="caption" sx={{ color: '#bbb' }}>
              Administrator
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        {/* Navigation menu */}
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <List component="nav" sx={{ pt: 0 }}>
            {menuItems.map((item) => (
              <ListItem disablePadding sx={{ mb: 0.5 }} key={item.text}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            
            <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            
            {/* Logout button */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,0,0,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f5f6fa',
          marginLeft: isMobile ? 0 : 0,
          paddingTop: isMobile ? 8 : 3,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {isMobile && <Toolbar />}
      </Box>
    </Box>
  );
};

export default Sidebar;