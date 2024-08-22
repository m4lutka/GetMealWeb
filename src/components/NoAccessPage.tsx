import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const NoAccessPage: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#fff',
        minHeight: '100vh',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        You do not have access to this page.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()} // Перезагрузка страницы
          sx={{
            borderColor: '#e96e0e',
            color: '#e96e0e',
            '&:hover': {
              borderColor: '#d76005',
              color: '#d76005',
            },
          }}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<AddBusinessIcon />} // Используйте нужную иконку
          onClick={() => window.location.href = '/owner-page'} // Перенаправление на страницу OwnerPage
          sx={{
            backgroundColor: '#e96e0e',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#d76005',
              color: '#fff',
            },
          }}
        >
          Become a partner!
        </Button>
      </Box>
    </Box>
  );
};

export default NoAccessPage;
