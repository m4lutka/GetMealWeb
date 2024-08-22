import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Header from '../../components/header';
import { Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import dashImg from "../../assets/Pics/Dashboard.png";

const drawerWidth = 240;

interface DrawerPanelProps {
  children?: React.ReactNode; // Define the children prop
}

const DrawerPanel: React.FC<DrawerPanelProps> = ({ children }) => {
  const location = useLocation();
  const isDashboardSelected = location.pathname.includes('/Dashboard');
  const isRestaurantsSelected = location.pathname.includes('/Restaurants');
  const isMenusSelected = location.pathname.includes('/Menus');
  const isItemsSelected = location.pathname.includes('/Items');

  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (!isDashboardSelected) {
      navigate('/organization/Dashboard');
    }
  };

  const handleRestaurantsClick = () => {
    if (!isRestaurantsSelected) {
      navigate('/organization/Restaurants');
    }
  };

  const handleMenusClick = () => {
    if(!isMenusSelected) {
      navigate('/organization/Menus')
    }
  }

  const handleItemsClick = () => {
    if(!isItemsSelected) {
      navigate('/organization/Items')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/Login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', width: '100vw' }}>
      <CssBaseline />
      <Header
        showSearch={false}
        sx={{
          position: 'fixed',
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          zIndex: 1201
        }}
      />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            zIndex: 1200,  // Убедимся, что Drawer ниже Header
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={isDashboardSelected} onClick={handleDashboardClick} disabled={isDashboardSelected}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={isRestaurantsSelected} onClick={handleRestaurantsClick} disabled={isRestaurantsSelected}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText primary="Restaurants" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={isMenusSelected} onClick={handleMenusClick} disabled={isMenusSelected}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              <ListItemText primary="Menus" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton selected={isItemsSelected} onClick={handleItemsClick} disabled={isItemsSelected}>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Items" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Product Stock" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <ListItemText primary="ORDERS" sx={{ fontWeight: 'bold' }} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Active Orders" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Completed Orders" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Cancelled Orders" />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 0, mt: 'auto' }}>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    bgcolor: '#f5f5f5',
    p: 3,
    mt: '64px',
    width: `calc(100% - ${drawerWidth}px)`,  // Учитываем ширину Drawer
    ml: `${drawerWidth}px`,  // Учитываем отступ для Header
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: "0px",
  }}
>
  {children}
      </Box>
    </Box>
  );
}

export default DrawerPanel;