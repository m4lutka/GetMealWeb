import React, { useState, useEffect } from 'react';
import { Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, CardContent, CardActions, Grid, Chip } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import DrawerPanel from '../DrawerPanel';
import NoAccessPage from '../../NoAccessPage';
import StepperMenu from './StepperMenuForItems'
import AuthService from './AuthServiceItems';
import { useNavigate } from 'react-router-dom';

const Items: React.FC = () => {
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
        }
    }, [isAuthenticated, isOrganization]);

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
                            <Typography variant="h4" gutterBottom sx={{mt: -7, mb: 5}}>
                                Items
                            </Typography>
                            <Grid
                                container
                                spacing={2} // Уменьшено расстояние между карточками
                                justifyContent="center" // Центрирование карточек
                                sx={{ maxWidth: '900px', margin: '0 auto' }} // Ограничение максимальной ширины и центрирование контейнера
                            >
                                {items.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                                        <Card sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%', // Фиксированная ширина карточки
                                            height: '100%', // Фиксированная высота карточки
                                            maxWidth: 300, // Максимальная ширина
                                            minHeight: 220,
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: 6,
                                            },
                                            mx: 'auto', // Центрирование карточки внутри столбца
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {item.description}
                                                </Typography>
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
                                <StepperMenu/>
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

export default Items;
