import React, {useState} from 'react';
import { FunctionComponent } from "react";
import ButtonComponent from '../../components/ButtonComponent';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import styles from './Login.module.css';
import Circles from '../../components/Circles';
import Logo from "../../components/Logo"
import {
  TextField,
  Link,
  Typography,
  Button,
  TextFieldProps,
} from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import AuthService from "../../auth/AuthService";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { TransitionProps } from '@mui/material/transitions';
import Slide, { SlideProps } from '@mui/material/Slide';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

const RedditTextField = styled((props: TextFieldProps) => (
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

  export type DesktopType = {
    className?: string;
  };

  const LoginPage: FunctionComponent<DesktopType> = ({ className = "" }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorOpen, setErrorOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

    try {

      const loginResponse = await AuthService.login(email, password);
      console.log('Login successful:', loginResponse);

      localStorage.setItem('accessToken', loginResponse.access);
      localStorage.setItem('refreshToken', loginResponse.refresh);

      AuthService.setAuthHeader(loginResponse.access);

      navigate("/main");
    } catch (error) {
      console.error("Registration or login failed:", error);
      setErrorOpen(true);
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
    <div className={styles.container}>
        <Typography variant="h1" component="h2" style={{fontFamily: "var(--font-adamina)", fontSize:"5em"}}>
             Please sign in!
        </Typography>
        <Typography variant="subtitle1" gutterBottom style={{fontFamily: "var(--font-adamina)", fontSize:"20px", marginTop: "10px", opacity: "50%"}}>
        Please login into your account to continue.
      </Typography>
      <RedditTextField
        label="Enter your login"
        id="reddit-input"
        variant="filled"
        color="info"
        value = {email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginTop: 11, width: "355px"}}
        InputLabelProps={{
            sx: {
              color: 'black',
              opacity: "50%",
              '&.Mui-focused': {
                color: '#000',
              },
            },
          }}
      />
      <RedditTextField
        label="Enter your password"
        id="reddit-input"
        variant="filled"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        color="info"
        style={{ marginTop: 11, width:"355px"}}
        InputLabelProps={{
            sx: {
              color: 'black',
              opacity: "50%",
              '&.Mui-focused': {
                color: '#000',
              },
            },
          }}
      />
      <div className={styles.buttonWrapper}>
        <ButtonComponent
          text="Submit"
          onClick={handleSubmit}
          sx={{ marginTop: '-15px', width: '300px', color: "#fff", height: "64px" }}
        />
      </div>
      <Typography variant="body2" align="center" sx={{ mt: 2, ml: -1}}>
            <Link component={RouterLink} to="/Registration" color="primary" underline="hover" sx={{ color: "#e96e0e", fontSize: "17px", "&:hover": { color: "#d6892b" } }}>
              Don't have account ?
            </Link>
          </Typography>
      <Circles/>
      <Logo />
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
          Invalid login or password. Please try again.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;