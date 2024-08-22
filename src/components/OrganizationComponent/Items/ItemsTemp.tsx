import React, { useState, useEffect } from 'react';
import { Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, CardContent, CardActions, Grid, CardMedia } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import DrawerPanel from '../DrawerPanel';
import NoAccessPage from '../../NoAccessPage';
import StepperMenu from './StepperMenuForItems';
import AuthService from './AuthServiceItems';
import { useNavigate } from 'react-router-dom';

// Импортируем изображения
import fantaImage from '../../../assets/Pics/fanta3.png';
import glassWaterImage from '../../../assets/Pics/glass_water.jpg';
import colaImage from '../../../assets/Pics/cola.png';

const ItemsTemp: React.FC = () => {
    const { isAuthenticated, isOrganization } = useAuth();
    const navigate = useNavigate();
    const [openItem, setOpenItem] = useState(false);
    const [items, setItems] = useState<any[]>([]); // Убедитесь, что тип данных соответствует вашему API

    const handleAddNewItemClick = () => {
        setOpenItem(true);
    };

    const handleCloseItem = () => {
        setOpenItem(false); // Обновление списка предметов после закрытия диалога
    };

    // const fetchItems = async () => {
    //     try {
    //         const fetchedItems = await AuthService.getItems(); // Предполагаем, что AuthService.getItems возвращает список предметов
    //         setItems(fetchedItems);
    //     } catch (error) {
    //         console.error('Error fetching items:', error);
    //     }
    // };

    const handleEditItem = (itemId: string) => {
        navigate(`/edit-item/${itemId}`);
    };

    useEffect(() => {
        if (isAuthenticated && isOrganization) {
            // fetchItems(); // Раскомментируйте и вызовите fetchItems при необходимости
        }
    }, [isAuthenticated, isOrganization]);

    // Пример данных с изображениями
    const exampleItems = [
        { id: '1', name: 'Fanta', description: 'Fruity soda', composition: 'Carbonated water, sugar, flavor', price: '250 ₸', image: fantaImage },
        { id: '2', name: 'Water', description: 'Simple water', composition: 'Water', price: '200 ₸', image: glassWaterImage },
        { id: '3', name: 'Cola', description: 'Classic cola', composition: 'Carbonated water, sugar, caramel color', price: '300 ₸', image: colaImage },
    ];

    return (
        <div>
            {isAuthenticated && isOrganization ? (
                <DrawerPanel>
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
                                onClick={handleAddNewItemClick}
                                sx={{
                                    backgroundColor: '#e96e0e', // Оранжевый цвет
                                    '&:hover': {
                                        backgroundColor: '#d76005', // Темнее оранжевый цвет при наведении
                                    },
                                    fontSize: '0.9rem', // Увеличение размера шрифта
                                    padding: '8px 20px', // Увеличение размера кнопки
                                }}
                            >
                                Add New Item
                            </Button>
                        </Box>
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="h4" gutterBottom sx={{ mt: -7, mb: 5 }}>
                                Items
                            </Typography>
                            <Grid
                                container
                                spacing={2} // Уменьшено расстояние между карточками
                                justifyContent="center" // Центрирование карточек
                                sx={{ maxWidth: '900px', margin: '0 auto' }} // Ограничение максимальной ширины и центрирование контейнера
                            >
                                {exampleItems.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <Card sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%', // Фиксированная ширина карточки
                                            height: '100%', // Фиксированная высота карточки
                                            maxWidth: 350, // Максимальная ширина
                                            minHeight: 400, // Увеличенная высота
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: 6,
                                            },
                                            mx: 'auto', // Центрирование карточки внутри столбца
                                        }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ height: '350px', width: '100%', objectFit: 'cover' }}
                                                image={item.image}
                                                alt={item.name}
                                            />
                                            <CardContent>
                                                <Typography variant="h6" component="div" sx={{ mb: 2, textAlign: 'center' }}>
                                                    {item.name}
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Description:</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                                                        {item.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Composition:</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                                                        {item.composition}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Price:</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                                                        {item.price}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions>
                                                <Button onClick={() => handleEditItem(item.id)}>Edit</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Dialog open={openItem} onClose={handleCloseItem} fullWidth maxWidth="sm">
                            <DialogTitle>Add New Item</DialogTitle>
                            <DialogContent>
                                <StepperMenu />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseItem} color="primary">
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </DrawerPanel>
            ) : (
                <NoAccessPage />
            )}
        </div>
    );
};

export default ItemsTemp;
