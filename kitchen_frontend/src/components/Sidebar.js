import './Sidebar.css';

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

// Organized imports - all icons together













const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  
  const [open, setOpen] = useState(false);  
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await axios.get('http://localhost:4000/api/guides/get_guide', {
          headers: {
            token: token
          }
        });
        // Access the supervisor_name within the user object
        setUsername(response.data.user.supervisor_name); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching username:', error);
        setLoading(false);
      }
    };
  
    fetchUsername();
  }, []);
  
  // More descriptive and semantically appropriate icons for each menu item
  const menuItems = [
  
    { text: 'Add Products', icon: <AddCircleIcon />, path: '/Add-products' },
    { text: 'List Products', icon: <FormatListBulletedIcon />, path: '/list-products' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/n-orders' },
    { text: 'All Users', icon: <PeopleIcon />, path: '/all-users' },
  ];

  return (
    <Box>
      {isMobile && (
        <AppBar position="sticky" sx={{ backgroundColor: 'rgb(235, 117, 21)' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Kitchen</Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom,rgb(235, 117, 21),rgb(205, 93, 8))',
            color: 'white',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,  
        }}
      >
        {/* Header with company logo area */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          padding: '20px 10px',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}>
          <Avatar 
            sx={{ 
              bgcolor: '#fff', 
              color: '#1a237e',
              width: 70, 
              height: 70, 
              mb: 1,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <BusinessCenterIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
            Kitchen Management
          </Typography>
          
          <Chip 
            label={loading ? "Loading..." : "Kitchen"} 
            variant="outlined" 
            size="small"
            sx={{ 
              color: '#fff', 
              borderColor: 'rgba(255,255,255,0.5)', 
              mt: 1,
              fontSize: '0.85rem',
              '& .MuiChip-label': {
                fontWeight: 500
              }
            }} 
          />
        </Box>

        <Box sx={{ overflow: 'auto', overflowX: 'hidden', mt: 2 }}>
          <List>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.text}>
                <ListItem 
                  button 
                  component={Link} 
                  to={item.path}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    borderRadius: '4px',
                    mx: 1,
                    mb: 0.5
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
                {index < menuItems.length - 1 && (
                  <Divider sx={{ my: 0.5, backgroundColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Logout button (optional) */}
        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItem 
            button 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.3)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: '40px' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </Drawer>

      <Box sx={{ marginLeft: isMobile ? 0 : 280, transition: 'margin 0.3s' }}>
        {/* This is where your main content goes */}
      </Box>
    </Box>
  );
};

export default Sidebar;