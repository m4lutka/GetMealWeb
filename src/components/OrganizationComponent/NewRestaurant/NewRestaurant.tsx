import React, { useRef, useState } from 'react';
import DrawerPanel from '../DrawerPanel';
import { useAuth } from '../../../context/AuthContext';
import { Button, Box, TextField, outlinedInputClasses, Typography, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, useTheme, Theme } from '@mui/material/styles';
import UploadImage from '../../../components/UploadImage'; // Import your image upload component
import dayjs, {Dayjs} from 'dayjs';
import { TimeField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AuthService from '../../../auth/AuthService';
import NoAccessPage from '../../NoAccessPage';


// Define custom theme for text fields
const customTheme = (outerTheme: Theme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '--TextField-brandBorderColor': '#E0E3E7',
            '--TextField-brandBorderHoverColor': '#B2BAC2',
            '--TextField-brandBorderFocusedColor': '#6F7E8C',
            '& label.Mui-focused': {
              color: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: 'var(--TextField-brandBorderColor)',
          },
          root: {
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderHoverColor)',
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: 'var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            '&::before': {
              borderBottom: '2px solid var(--TextField-brandBorderColor)',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
            },
            '&.Mui-focused:after': {
              borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
            },
          },
        },
      },
    },
  });

  type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const NewRestaurant: React.FC = () => {
  const uploadImageRef = React.useRef<{ uploadImage: (file: File) => void } | null>(null);
  const { isAuthenticated, isOrganization } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [tableNum, setTableNum] = useState<number>(0);
  const [days, setDays] = useState<Record<Day, boolean>>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [times, setTimes] = useState<Record<Day, { open: Dayjs | null; close: Dayjs | null }>>({
    monday: { open: null, close: null },
    tuesday: { open: null, close: null },
    wednesday: { open: null, close: null },
    thursday: { open: null, close: null },
    friday: { open: null, close: null },
    saturday: { open: null, close: null },
    sunday: { open: null, close: null },
  });

  const [firstSelectedDay, setFirstSelectedDay] = useState<Day | null>(null);

  const handleCheckboxChange = (day: Day) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!firstSelectedDay) {
      setFirstSelectedDay(day);
    }

    setDays({ ...days, [day]: event.target.checked });

    if (!event.target.checked && day === firstSelectedDay) {
      setFirstSelectedDay(null);
    }
  };

  const handleTimeChange = (day: Day, type: 'open' | 'close') => (newValue: Dayjs | null) => {
    setTimes({ ...times, [day]: { ...times[day], [type]: newValue } });
  };

  const handleImageUpload = (file: File | null)  => {
    setImage(file);
  };

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


  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('table_num', tableNum.toString());
    if (firstSelectedDay) {
      formData.append(
        'work_time_open',
        times[firstSelectedDay].open?.format('HH:mm:ss') || '00:00:00'
      );
      formData.append(
        'work_time_close',
        times[firstSelectedDay].close?.format('HH:mm:ss') || '00:00:00'
      );
    } else {
      formData.append('work_time_open', '00:00:00');
      formData.append('work_time_close', '00:00:00');
    }

    if (image) {
      formData.append('image', image);
    } else {
      // Если изображение не загружено, добавляем null
      formData.append('image', '');
    }

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await AuthService.createNewRestaurant(formData);
      console.log('New restaurant created:', response);
      navigate('/organization/restaurants');
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                pt: 0, // Adjust padding-top to move the form higher
                }}
            >
                <Box
                sx={{
                    backgroundColor: '#ffffff',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: '900px',
                    margin: '0 auto',
                }}
                >
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 5 }}>
                    Add New Restaurant
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        label="Name"
                        variant="filled"
                        placeholder="Enter your restaurant name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        required
                        label="Address"
                        variant="filled"
                        placeholder="Enter restaurant address"
                        fullWidth
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(['monday', 'tuesday', 'wednesday', 'thursday'] as Day[]).map((day) => (
                        <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ minWidth: 70, flex: 1 }}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Typography>
                          <Checkbox
                            checked={days[day]}
                            onChange={handleCheckboxChange(day)}
                            inputProps={{ 'aria-label': `${day} controlled` }}
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                              label="Open"
                              value={times[day].open}
                              onChange={handleTimeChange(day, 'open')}
                              format="HH:mm"
                            />
                            <TimeField
                              label="Close"
                              value={times[day].close}
                              onChange={handleTimeChange(day, 'close')}
                              format="HH:mm"
                            />
                          </LocalizationProvider>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                    <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginTop: '-22px'  // Adjust this value to align with the Name field
                    }}
                    >
                    <UploadImage ref={uploadImageRef} onImageUpload={setImage} />
                    <TextField
                        required
                        label="Number of tables"
                        variant="filled"
                        placeholder="Enter number of tables"
                        type="number"
                        fullWidth
                        value={tableNum}
                        onChange={(e) => setTableNum(Number(e.target.value))}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(['friday', 'saturday', 'sunday'] as Day[]).map((day) => (
                        <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ minWidth: 70, flex: 1 }}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Typography>
                          <Checkbox
                            checked={days[day]}
                            onChange={handleCheckboxChange(day)}
                            inputProps={{ 'aria-label': `${day} controlled` }}
                          />
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                              label="Open"
                              value={times[day].open}
                              onChange={handleTimeChange(day, 'open')}
                              format="HH:mm"
                            />
                            <TimeField
                              label="Close"
                              value={times[day].close}
                              onChange={handleTimeChange(day, 'close')}
                              format="HH:mm"
                            />
                          </LocalizationProvider>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        backgroundColor: '#e96e0e', // Orange color
                        '&:hover': {
                        backgroundColor: '#d76005', // Darker orange on hover
                        },
                    }}
                    >
                    Save
                    </Button>
                </Box>
                </Box>
            </Box>
            </DrawerPanel>
        ) : (
            <NoAccessPage />
        )}
     </div>
    </LocalizationProvider>
  );
};

export default NewRestaurant;
