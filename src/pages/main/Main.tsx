import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import HeaderUNREG from '../../components/headerUNREG';
import AuthService from '../../auth/AuthService'; // Импортируем AuthService
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface Restaurant {
  name: string;
  address: string;
  image: string;
  work_days: string[];
  opening_time: string;
  table_num: number;
  menu_count: number;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await AuthService.getAllRestaurants();
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      {isAuthenticated ? <Header /> : <HeaderUNREG />}

      <Box
        sx={{
          width: '100vw',
          backgroundColor: '#f5f5f5', // Серый фон для контента
          padding: 2,
          paddingTop: 8,
          overflowY: 'auto', // Возможность прокрутки по вертикали
          maxHeight: 'calc(100vh - 10px)', // Учитываем высоту шапки и отступ сверху
          marginTop: '16px', // Расстояние сверху между header и карточками
          '&::-webkit-scrollbar': {
            display: 'none', // Убираем скроллбар в Webkit браузерах
          },
          scrollbarWidth: 'none', // Убираем скроллбар для Firefox
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Ширина карточек минимум 300px
            gap: 3, // Расстояние между карточками
            maxWidth: '1200px', // Максимальная ширина контейнера
            margin: '0 auto', // Центрирование контейнера
          }}
        >
          {restaurants.map((restaurant, index) => (
            <Card
              key={index}
              sx={{
                width: '100%', // Занимает всю ширину колонки
                height: 'auto', // Высота автоматически в зависимости от содержимого
                display: 'flex',
                flexDirection: 'column',
                marginTop: '16px', // Отступ сверху
                backgroundColor: '#fff', // Белый фон карточек
                boxShadow: 3, // Добавляем тень
                borderRadius: 2, // Закругляем углы
              }}
            >
              <CardMedia
                sx={{
                  height: '250px', // Высота изображения
                  objectFit: 'cover', // Обрезаем изображение, чтобы оно заполняло контейнер
                }}
                image={restaurant.image || '/static/images/cards/default-image.jpg'} // Устанавливаем картинку или дефолтную
                title={restaurant.name}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: 'center' }} // Центрируем название
                >
                  {restaurant.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textAlign: 'center' }} // Центрируем адрес
                >
                  {restaurant.address}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Days:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.work_days ? restaurant.work_days.join(', ') : 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Opening Time:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.opening_time || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Tables:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.table_num || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Menus:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {restaurant.menu_count || 0}
                  </Typography>
                </Box>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                  backgroundColor: '#fff', // Фон под кнопкой
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: '#d76005',
                    borderColor: '#d76005',
                    '&:hover': {
                      borderColor: '#d76005',
                      backgroundColor: '#fff',
                      color: '#d76005',
                    },
                  }}
                >
                  Order
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Main;
