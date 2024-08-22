import React from 'react';
import DrawerPanel from '../DrawerPanel';
import { useAuth } from '../../../context/AuthContext';
import { Button, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantList from '../RestaurantList';
import NoAccessPage from '../../NoAccessPage';

const Restaurants: React.FC = () => {
  const {isAuthenticated, isOrganization} = useAuth();
  const navigate = useNavigate();

  const handleAddNewRestaurantClick = () => {
    navigate('/organization/Restaurants/NewRestaurant');
  };
  return (
    <div>
    {isAuthenticated && isOrganization ? (
    <DrawerPanel >
    <Box
      component="main"
      sx={{
        minWidth: '100%',
        width: `calc(100% - ${240}px)`,
        flexGrow: 1,
        bgcolor: '#f5f5f5',
        p: 3,
        position: 'relative',
        pt: 4,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Кнопка в правом верхнем углу */}
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          right: 25,
          zIndex: 1200,
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddNewRestaurantClick}
          sx={{
            backgroundColor: '#e96e0e', // Оранжевый цвет
            '&:hover': {
              backgroundColor: '#d76005', // Темнее оранжевый цвет при наведении
            },
            fontSize: '0.9rem', // Увеличение размера шрифта
            padding: '8px 20px', // Увеличение размера кнопки
          }}
        >
          Add New Restaurant
        </Button>
      </Box>
        <RestaurantList />
    </Box>
  </DrawerPanel>
    ) : (
      <NoAccessPage />
    )}
    </div>
  );
};

export default Restaurants;