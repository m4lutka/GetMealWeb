import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  TextFieldProps,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Slide, { SlideProps } from '@mui/material/Slide';
import { alpha, styled } from '@mui/material/styles';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import AuthService from '../auth/AuthService';
import { Navigate } from 'react-router-dom';

const placeholderImage = 'https://via.placeholder.com/140';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

// Определение стилей для TextField
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

const steps = ['Menu Name', 'To Restaurants', 'New Category'];

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string | null;
}

interface StepperMenuProps {
  onFinish?: () => void; // Пропс для уведомления о завершении
}

const StepperMenu: React.FC<StepperMenuProps> = ({ onFinish }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [menuName, setMenuName] = useState('');
  const [description, setDescription] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set());
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdMenuId, setCreatedMenuId] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await AuthService.getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const isStepOptional = (step: number) => step === 5;
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!menuName.trim()) {
        setErrorMessage('Please fill in the Menu Name.');
        setErrorOpen(true);
        return;
      }
      if (!description.trim()) {
        setErrorMessage('Please fill in the Description.');
        setErrorOpen(true);
        return;
      }
    } else if (activeStep === 1) {
      if (selectedRestaurants.size === 0) {
        setErrorMessage('Please select at least one restaurant.');
        setErrorOpen(true);
        return;
      }

      // Handle data creation
      setLoading(true);
      try {
        // Check if menu name exists
        const menuNameExists = await AuthService.checkMenuNameExists(menuName);
        if (menuNameExists) {
          setErrorMessage('Menu with this name already exists.');
          setErrorOpen(true);
          setLoading(false);
          return;
        }

        const menuData = {
          name: menuName,
          description,
          restaurant: Array.from(selectedRestaurants),
        };
        console.log('Sending data to create menu:', menuData);
        const response = await AuthService.createMenu(menuData);
        setCreatedMenuId(response.id); // Save created menu ID
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Move to next step
      } catch (error) {
        console.error('Error creating menu:', error);
        setErrorMessage('Failed to create menu.');
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
      return; // Prevent moving to the next step until the menu creation is done
    } else if (activeStep === 2) {
      // This part should use the existing menu ID to check if the menu exists.
      if (!createdMenuId) {
        setErrorMessage('No menu created to associate with categories.');
        setErrorOpen(true);
        return;
      }

      try {
        const menuExists = await AuthService.checkMenuNameExists(menuName); // Use checkMenuNameExists here
        if (menuExists) {
          handleFinish(); // Proceed to finish if menu exists
        } else {
          setErrorMessage('The created menu does not exist.');
          setErrorOpen(true);
        }
      } catch (error) {
        console.error('Error checking menu existence:', error);
        setErrorMessage('Failed to verify menu existence.');
        setErrorOpen(true);
      }
      return; // Prevent moving to the next step until menu existence is confirmed
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

  const handleFinish = async () => {
    console.log('Menu creation process finished');
    if (!createdMenuId) {
      setErrorMessage('No menu created to associate with categories.');
      setErrorOpen(true);
      return;
    }

    try {
      for (const cat of categories) {
        const categoryData = {
          name: cat,
          description: 'Default description', // Adjust this if needed
          menu: Number(createdMenuId),
        };
        console.log(categoryData);
        await AuthService.createCategory(categoryData);
      }
      console.log('Categories created successfully');

      // Optionally reset the form or navigate to another page
      if (onFinish) onFinish();
    } catch (error) {
      console.error('Error creating categories:', error);
      setErrorMessage('Failed to create categories.');
      setErrorOpen(true);
    }
  };

  const handleSnackbarClose = () => setErrorOpen(false);

  const handleRestaurantToggle = (id: string) => {
    setSelectedRestaurant(id);
    setSelectedRestaurants(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleAddCategory = () => {
    if (category.trim() === '') {
      setErrorMessage('Category name cannot be empty.');
      setErrorOpen(true);
      return;
    }
    if (categories.includes(category.trim())) {
      setErrorMessage('This category already exists.');
      setErrorOpen(true);
      return;
    }
    setCategories([...categories, category.trim()]);
    setCategory(''); // Clear input field after adding
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1, mt: 5, mb: 3 }}>
            <TextField
              id="custom-input-with-sx"
              label="Menu Name"
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MenuBookIcon />
                  </InputAdornment>
                ),
              }}
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              sx={{
                width: '80%',
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#e96e0e',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#d76005',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#e96e0e',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: '#e96e0e',
                },
              }}
              InputLabelProps={{ style: { fontSize: '1.25rem' } }}
            />
            <TextField
              id="custom-input-description"
              label="Description"
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                width: '80%',
                marginTop: '20px',
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#e96e0e',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#d76005',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#e96e0e',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: '#e96e0e',
                },
              }}
              InputLabelProps={{ style: { fontSize: '1.1rem' } }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select a Restaurant
            </Typography>
            <Grid container spacing={3}>
              {restaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      border: selectedRestaurant === restaurant.id ? '3px solid #d76005' : '1px solid #ccc',
                      boxShadow: selectedRestaurant === restaurant.id ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        border: selectedRestaurant === restaurant.id ? '3px solid #d76005' : '2px solid #e96e0e',
                        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                      },
                    }}
                    onClick={() => handleRestaurantToggle(restaurant.id)}
                  >
                    <CardMedia
                      sx={{ height: 140 }}
                      image={restaurant.image || placeholderImage}
                      title={restaurant.name}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ textAlign: 'center', color: 'black' }}>{restaurant.name}</Typography>
                      <Typography variant="body2" sx={{ textAlign: 'center', color: 'black', opacity: 0.5 }}>{restaurant.address}</Typography>
                      <FormControlLabel
                        control={<Checkbox checked={selectedRestaurants.has(restaurant.id)} />}
                        label="Select"
                        sx={{ textAlign: 'center', mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              New Category
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StyledTextField
                label="Add New Category"
                variant="filled"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddCategory} edge="end">
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {categories.map((cat, index) => (
                <Chip
                  key={index}
                  label={cat}
                  onDelete={() => handleDeleteCategory(cat)}
                  deleteIcon={<CancelIcon />}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        );

      default:
        return <div>Unknown step</div>;
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
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} orientation="horizontal"
        sx={{
          '& .MuiStepIcon-root.Mui-active': { color: '#d76005' },
          '& .MuiStepIcon-root.Mui-completed': { color: '#e96e0e' },
        }}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                mr: 1,
                color: activeStep === 0 ? 'white' : 'white',
                backgroundColor: activeStep === 0 ? '#e96e0e' : '#e96e0e',
                '&:hover': { backgroundColor: '#d76005' },
              }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
              disabled={loading}
              sx={{
                color: 'white',
                backgroundColor: '#e96e0e',
                '&:hover': { backgroundColor: '#d76005' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (activeStep === steps.length - 1 ? 'Finish' : 'Next')}
            </Button>
          </Box>
        </React.Fragment>
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
    </Box>
  );
};

export default StepperMenu;