import React, { useState, useEffect } from 'react';
import { Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Card, CardContent, CardActions, IconButton, Grid, Chip } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import DrawerPanel from '../DrawerPanel';
import NoAccessPage from '../../NoAccessPage';
import StepperMenu from '../../StepperMenu';
import AuthService from '../../../auth/AuthService';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const Menus: React.FC = () => {
    const { isAuthenticated, isOrganization } = useAuth();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [menus, setMenus] = useState<any[]>([]); // Убедитесь, что тип данных соответствует вашему API
    const [categoriesMap, setCategoriesMap] = useState<Map<number, string[]>>(new Map()); // Для хранения категорий по меню

    const handleAddNewMenuClick = () => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        fetchMenus(); // Обновление списка меню после закрытия диалога
    };

    const fetchCategories = async (menuId: number) => {
        try {
            const response = await AuthService.getCategories(menuId); // Предполагается, что AuthService.getCategories принимает menuId и возвращает категории
            const categoryNames = response.map((category: { name: string }) => category.name);
            setCategoriesMap(prevMap => new Map(prevMap).set(menuId, categoryNames));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchMenus = async () => {
        try {
            const fetchedMenus = await AuthService.getMenus(); // Предполагаем, что AuthService.getMenus возвращает список меню
            setMenus(fetchedMenus);

            // Запрашиваем категории для каждого меню
            fetchedMenus.forEach(menu => {
                fetchCategories(menu.id);
            });
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const handleEditMenu = (menuId: string) => {
        navigate(`/edit-menu/${menuId}`);
    };

    useEffect(() => {
        if (isAuthenticated && isOrganization) {
            fetchMenus();
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
                                onClick={handleAddNewMenuClick}
                                sx={{
                                    backgroundColor: '#e96e0e', // Оранжевый цвет
                                    '&:hover': {
                                        backgroundColor: '#d76005', // Темнее оранжевый цвет при наведении
                                    },
                                    fontSize: '0.9rem', // Увеличение размера шрифта
                                    padding: '8px 20px', // Увеличение размера кнопки
                                }}
                            >
                                Add New Menu
                            </Button>
                        </Box>
                        <Box sx={{ mt: 10 }}>
                            <Typography variant="h4" gutterBottom sx={{mt: -7, mb: 5}}>
                                Menus
                            </Typography>
                            <Grid
                                container
                                spacing={2} // Уменьшено расстояние между карточками
                                justifyContent="center" // Центрирование карточек
                                sx={{ maxWidth: '900px', margin: '0 auto' }} // Ограничение максимальной ширины и центрирование контейнера
                            >
                                {menus.map((menu) => (
                                    <Grid item xs={12} sm={6} md={4} key={menu.id}>
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
                                                    {menu.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {menu.description}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                                    {(categoriesMap.get(menu.id) || []).map((categoryName, index) => (
                                                        <Chip key={index} label={categoryName} size="small" />
                                                    ))}
                                                </Stack>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton onClick={() => handleEditMenu(menu.id)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Dialog open={openMenu} onClose={handleCloseMenu} fullWidth maxWidth="sm">
                            <DialogTitle>Add New Menu</DialogTitle>
                            <DialogContent>
                                <StepperMenu onFinish={handleCloseMenu} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseMenu} color="primary">
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

export default Menus;
