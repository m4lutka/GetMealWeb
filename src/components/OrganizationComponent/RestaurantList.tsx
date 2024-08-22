// src/pages/organization/RestaurantList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, CardMedia } from '@mui/material';
import AuthService from '../../auth/AuthService';
import DrawerPanel from '../OrganizationComponent/DrawerPanel';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';
import qrcode from 'qrcode-generator';
import jsPDF from 'jspdf';
import "../../styles/font.css"
import NoAccessPage from '../NoAccessPage';
const placeholderImage = 'https://via.placeholder.com/140';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string | null;
  table_num: number;
  work_time_open: string;
  work_time_close: string;
  work_days: string[];
  available_menus?: number;
}

const formatTime = (timeString: string) => {
    // Проверка наличия времени в формате hh:mm:ss
    if (timeString.length >= 5) {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    }
    return timeString; // Возвращаем исходную строку, если она не в формате hh:mm:ss
  };

const RestaurantList: React.FC = () => {
  const { isAuthenticated, isOrganization } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleEdit = (id: string) => {
    navigate(`/organization/restaurants/${id}/edit`);
  };

  const formatWorkDays = (work_days?: string[]) => {
    if (!work_days || work_days.length === 0) {
      return 'Not available';
    } else if (work_days.length === 1) {
      return work_days[0];
    } else if (work_days.length > 1) {
      return `${work_days[0]}-${work_days[work_days.length - 1]}`;
    }
  };

  const generateQrCode = async (url: string) => {
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    return qr.createDataURL();
  };

  const generatePdf = async (rest_id: string, table_num: number) => {
    console.log('Generating PDF for Restaurant ID:', rest_id, 'with', table_num, 'tables');

    const doc = new jsPDF();
    let urls = [];

    for (let i = 1; i <= table_num; i++) {
      const url = `https://getmeal.u2p.kz/#/${rest_id}?table=${i}`;
      console.log('Generating QR for URL:', url);
      urls.push(url);
    }

    for (let i = 0; i < urls.length; i++) {
      const qrDataUrl = await generateQrCode(urls[i]);
      console.log('QR Data URL generated:', qrDataUrl);

      doc.addImage(qrDataUrl, 'PNG', 10, 10, 190, 190);
      doc.text(urls[i], 60, 240);

      if (i < urls.length - 1) {
        doc.addPage();
      }
    }

    doc.save('qrcodes.pdf');
    console.log('PDF saved');
  };

  const handlePrintQrs = (rest_id: string, table_num: number) => {
    console.log('Print QRs clicked');
    console.log('Restaurant ID:', rest_id);
    console.log('Table Number:', table_num);
    generatePdf(rest_id, table_num);
  };

  return (
    <div>
      {isAuthenticated && isOrganization ? (
        <Box
          component="main"
          sx={{
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%',
            bgcolor: '#f5f5f5',
            p: 3,
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              p: 3,
              borderRadius: 2,

              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            <Typography variant="h3" sx={{ mb: 2, fontWeight: "500", mt: -2, fontSize: "2vw"}}>
              Restaurants
            </Typography>
            <Grid container spacing={3}>
              {restaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={restaurant.image ? restaurant.image : placeholderImage}
                      title={restaurant.name}
                    />
                    <CardContent>
                      <Button
                        variant="text"
                        endIcon={<QrCodeIcon />}
                        onClick={() => handlePrintQrs(restaurant.id, restaurant.table_num)}
                        sx={{ color: 'gray', fontSize: '0.75rem', textTransform: 'none', mb: 0, ml: 30, }}
                      >
                        Print QRs
                      </Button>
                      <Typography variant="h6" sx={{textAlign: 'center', color: 'black'}}>{restaurant.name}</Typography>
                      <Typography variant="body2" sx={{ textAlign: 'center', color: 'black', opacity: 0.5 }}>{restaurant.address}</Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <span>Work days:</span>
                                <span>{formatWorkDays(restaurant.work_days)}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><span>Working Hours:</span><span>{`${formatTime(restaurant.work_time_open)} - ${formatTime(restaurant.work_time_close)}`}</span></Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><span>Number of Tables:</span><span>{restaurant.table_num}</span> </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <span>Available Menus:</span>
                            <span>{restaurant.available_menus ?? 0}</span>
                        </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(restaurant.id)}
                        sx={{ mt: 2 }}
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        <p><NoAccessPage /></p>
      )}
    </div>
  );
};

export default RestaurantList;
