import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  TextFieldProps,
} from '@mui/material';
import Slide, { SlideProps } from '@mui/material/Slide';
import AuthService from './AuthServiceItems'; // Убедитесь, что путь к AuthService правильный
import { styled, alpha } from '@mui/material/styles';
import UploadImage from '../../UploadImage';
import { OutlinedInputProps } from '@mui/material';

const placeholderImage = 'https://via.placeholder.com/140';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const steps = ['Item Info', 'Select Menu', 'Select Category'];

interface Menu {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const StyledTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'light' ? '#Fff' : '#1A2027',
    border: '2px solid',
    borderColor: '#e96e0e',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: '#d76005',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: `${alpha('#d76005', 0.25)} 0 0 0 3px`,
      borderColor: '#d76005',
    },
  },
}));

// Стили для кнопок и панели отслеживания шагов
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d76005',
  color: '#fff',
  '&:hover': {
    backgroundColor: alpha('#d76005', 0.8),
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    color: '#d76005',
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: '#d76005',
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: '#d76005',
  },
}));

const StepperItem: React.FC = () => {
  const uploadImageRef = React.useRef<{ uploadImage: (file: File) => void } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [itemInfo, setItemInfo] = useState({ name: '', description: '', image: '' });
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<Set<number>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemIngredients, setItemIngredients] = useState('');

  const handlePaste = (event: ClipboardEvent) => {
    if (event.clipboardData && event.clipboardData.items) {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && uploadImageRef.current) {
            uploadImageRef.current.uploadImage(file); // Загрузка файла через переданный пропс
          }
        }
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste as any);
    return () => {
      document.removeEventListener('paste', handlePaste as any);
    };
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menus = await AuthService.getAllMenus(); // Замените на метод получения всех меню
        setMenus(menus);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedMenus.size > 0) {
        try {
          const menuIds = Array.from(selectedMenus);
          const categories = await AuthService.getCategories(menuIds);
          setCategories(categories);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [selectedMenus]);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!itemName.trim()){
        setErrorMessage('Please fill in the Menu Name.');
        setErrorOpen(true);
        return;
      }
      if (!itemDescription.trim()){
        setErrorMessage('Please fill in the item Description.');
        setErrorOpen(true);
        return;
      }
      if (!itemPrice.trim()){
        setErrorMessage('Please fill in the Item Price.');
        setErrorOpen(true);
        return;
      }
      if (!itemIngredients.trim()){
        setErrorMessage('Please fill in the Item Ingredients.');
        setErrorOpen(true);
        return;

    }
   } else if (activeStep === 1) {
      if (selectedMenus.size === 0) {
        setErrorMessage('Please select at least one menu.');
        setErrorOpen(true);
        return;
      }
    } else if (activeStep === 2) {
      if (selectedCategories.size === 0) {
        setErrorMessage('Please select at least one category.');
        setErrorOpen(true);
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const ingredients = itemIngredients.split(',').map(ingredient => ingredient.trim());

        const formData = new FormData();
        formData.append('name', itemName);
        formData.append('description', itemDescription);
        formData.append('composition', JSON.stringify(ingredients));
        formData.append('price', String(itemPrice));
        formData.append('discount', '0');
        formData.append('menu', JSON.stringify(Array.from(selectedMenus)));
        formData.append('category', JSON.stringify(Array.from(selectedCategories)));
        formData.append('additional_option', JSON.stringify([]));

        if (image) {
          formData.append('image', image); // Убедитесь, что image - это объект File
        }

        console.log(image); // Должно быть File, а не массив
        console.log(image instanceof File); // Должно быть true

        // Логируем содержимое FormData
        formData.forEach((value, key) => {
          if (key === 'image') {
            console.log(`${key}:`, value); // Должно быть File
          } else {
            console.log(`${key}: ${value}`);
          }
        });

        const response = await AuthService.createItem(formData);

        console.log('Response:', response);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (error) {
        console.error('Failed to create item:', error);
        setErrorMessage('Failed to create item.');
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

  const handleSnackbarClose = () => setErrorOpen(false);

  const handleMenuToggle = (id: number) => {
    setSelectedMenus((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleCategoryToggle = (id: number) => {
    setSelectedCategories((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, mt: 5, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Item Name"
                  variant="filled"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Item Description"
                  variant="filled"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Item Price"
                  variant="filled"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Item Ingredients (separated with comma)"
                  variant="filled"
                  value={itemIngredients}
                  onChange={(e) => setItemIngredients(e.target.value)}
                  sx={{ width: '100%' }}
                  placeholder="beef, pasta, sauce"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <UploadImage
                    ref={uploadImageRef}
                    onImageUpload={(file) => {
                      console.log('Uploaded file:', file);
                      setImage(file);
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 5, mb: 3 }}>
            <Grid container spacing={2}>
              {menus.map((menu) => (
                <Grid item xs={12} sm={6} md={4} key={menu.id}>
                  <Card
                    sx={{
                      backgroundColor: selectedMenus.has(menu.id) ? '#d76005' : '#f5f5f5',
                      cursor: 'pointer',
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 2,
                      '&:hover': {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleMenuToggle(menu.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{menu.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 5, mb: 3 }}>
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      backgroundColor: selectedCategories.has(category.id) ? '#d76005' : '#f5f5f5',
                      cursor: 'pointer',
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 2,
                      '&:hover': {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{category.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <StyledStepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </StyledStepper>
      {activeStep === steps.length ? (
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <StyledButton onClick={handleReset}>Reset</StyledButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <StyledButton
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </StyledButton>
            <Box sx={{ flex: '1 1 auto' }} />
            <StyledButton onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </StyledButton>
          </Box>
        </Box>
      )}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default StepperItem;
