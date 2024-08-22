import React, {useState} from "react";
import { FunctionComponent } from "react";
import { useNavigate, Link as RouterLink} from "react-router-dom";
import {
  TextField,
  Link,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextFieldProps,
} from "@mui/material";
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import styles from "./Desktop.module.css";
import Circ1 from "../assets/Pics/Circ1.svg";
import Circ2 from "../assets/Pics/Circ2.svg";
import Circ3 from "../assets/Pics/Circ3.svg";
import Circ4 from "../assets/Pics/Circ4.svg";
import Circ5 from "../assets/Pics/Circ5.svg";
import Circ6 from "../assets/Pics/Circ6.svg";
import Logo from "../assets/Pics/Logo.svg";
import AuthService from "../auth/AuthService";
import Slide, { SlideProps } from '@mui/material/Slide';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';

const AnimatedTextField = styled((props: TextFieldProps) => (
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

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type DesktopType = {
  className?: string;
};

const Desktop: FunctionComponent<DesktopType> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { login } = useAuth();


  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason? : SnackbarCloseReason,
  ) => {
    if (reason === "clickaway"){
      return;
    }
    setOpenSnackbar(false);
  };


  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email");
      setOpenSnackbar(true);
      return;
    }

    try {
      const registerResponse = await AuthService.register(email, password);
      console.log('Registration successful:', registerResponse);
      login();
      navigate("/main");
    } catch (error: any) {
      console.error("Registration or login failed:", error);
      if (error.response && error.response.status === 400){
        setErrorMessage("This email is already registered!")
      } else {
        setErrorMessage("Registration failed. Please try again")
      }
      setOpenSnackbar(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.desktopContainer}>
      <img className={`${styles.circ1}`} alt="Circle 1" src={Circ1} />
      <img className={`${styles.circ2}`} alt="Circle 2" src={Circ2} />
      <img className={`${styles.circ3}`} alt="Circle 3" src={Circ3} />
      <img className={`${styles.circ4}`} alt="Circle 4" src={Circ4} />
      <img className={`${styles.circ5}`} alt="Circle 5" src={Circ5} />
      <img className={`${styles.circ6}`} alt="Circle 6" src={Circ6} />

      <form className={`${styles.desktop1} ${className}`} style={{ marginLeft: '20px' }}>
        <div className={styles.window}>
          <img className={styles.icon} alt="" src="" />
          <img
            className={styles.layer1Icon}
            loading="lazy"
            alt=""
            src="/layer-1.svg"
          />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.registrationLabelParent}>
            <div className={styles.registrationLabel}>
              <h1 className={styles.registration} style={{fontSize: "60px" }}>Registration</h1>
            </div>
            <div className={styles.enterYourEmail}>
              Enter your email address and password to create account
            </div>
          </div>
          <AnimatedTextField
            label="Your Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ marginTop: 0.5, width: "355px" }}
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
          <AnimatedTextField
            label="Your Password"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ marginTop: -2, width: "355px" }}
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
          {/* <div className={styles.Checkboxico}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<PeopleIcon fontSize="large" />}
                  checkedIcon={<PeopleIcon fontSize="large" />}
                />
              }
              label="Organization?"
              sx={{
                margin: "-20px 0px -20px",
                "& .MuiFormControlLabel-label": {
                  fontSize: "16px",
                  color: "rgba(0, 0, 0, 0.5)",
                },
              }}
            />
          </div> */}

          <div className={styles.submitButton}>
            <Button
              className={styles.submission}
              disableElevation
              variant="contained"
              sx={{
                textTransform: "none",
                color: "#dcdcdc",
                fontSize: "40px",
                background: "#e96e0e",
                border: "#e96e0e solid 3px",
                borderRadius: "10px",
                "&:hover": { background: "#e96e0e" },
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto"
              }}

              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
          <Typography variant="body2" align="center" sx={{ mt: -1, ml: 12}}>
            <Link component={RouterLink} to="/login" color="primary" underline="hover" sx={{ color: "#e96e0e", fontSize: "17px", "&:hover": { color: "#d6892b" } }}>
              Already signed up?
            </Link>
          </Typography>

        </div>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Link component={RouterLink} to="/main">
        <div className={styles.logoContainer}>
          <img className={styles.logo} alt="Logo" src={Logo} />
        </div>
      </Link>
    </div>
  );
};

export default Desktop;