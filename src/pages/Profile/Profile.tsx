import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Fab } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Очистка токенов и других данных аутентификации
    // Пример: localStorage.removeItem('authToken');
    navigate('/login'); // Перенаправление на страницу входа
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderRadius: 1,
            boxShadow: 3,
            bgcolor: 'background.paper',
            position: 'relative'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to your profile
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Manage your settings and preferences here.
          </Typography>
          {/* Floating Action Button for Logout */}
          <Fab
            color="primary"
            aria-label="logout"
            onClick={handleLogout}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <LogoutIcon />
          </Fab>
        </Box>
      </Container>
    </>
  );
};

export default Profile;
