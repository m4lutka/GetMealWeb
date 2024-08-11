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
} from "@mui/material";
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

  const [isOrganization, setIsOrganization] = useState(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason? : SnackbarCloseReason,
  ) => {
    if (reason === "clickaway"){
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOrganizationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsOrganization(checked);

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email");
      setOpenSnackbar(true);
      return;
    }

    try {
      const registerResponse = await AuthService.register(email, password, isOrganization);
      console.log('Registration successful:', registerResponse);

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

  return (
    <div className={styles.desktopContainer}>
      <img className={`${styles.circ1}`} alt="Circle 1" src={Circ1} />
      <img className={`${styles.circ2}`} alt="Circle 2" src={Circ2} />
      <img className={`${styles.circ3}`} alt="Circle 3" src={Circ3} />
      <img className={`${styles.circ4}`} alt="Circle 4" src={Circ4} />
      <img className={`${styles.circ5}`} alt="Circle 5" src={Circ5} />
      <img className={`${styles.circ6}`} alt="Circle 6" src={Circ6} />

      <form className={`${styles.desktop1} ${className}`}>
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
              <h1 className={styles.registration}>Registration</h1>
            </div>
            <div className={styles.enterYourEmail}>
              Enter your email address and password to create account
            </div>
          </div>
          <TextField
            className={styles.emailInput}
            placeholder="Your Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& fieldset": { display: "none" },
              "& .MuiInputBase-root": {
                border: "none",
                height: "10px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                fontSize: "20px",
                width: "355px",
              },
              "& .MuiInputBase-input": { color: "rgba(0, 0, 0, 0.5)" },
              width: "355px",
            }}
          />
        </div>
        <div className={styles.passwordInputParent}>
          <TextField
            className={styles.passwordInput}
            placeholder="Your Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& fieldset": { display: "none" },
              "& .MuiInputBase-root": {
                border: "none",
                height: "10px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                fontSize: "20px",
              },
              "& .MuiInputBase-input": { color: "rgba(0, 0, 0, 0.3)" },
            }}
          />
          <div className={styles.Checkboxico}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<PeopleIcon fontSize="large" />}
                  checkedIcon={<PeopleIcon fontSize="large" />}
                  checked={isOrganization}
                  onChange={handleOrganizationChange}
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
          </div>

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
          <Typography variant="body2" align="center" sx={{ mt: -1, ml: -1}}>
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
      <div className={styles.logoContainer}>
        <img className={styles.logo} alt="Logo" src={Logo} />
      </div>
    </div>
  );
};

export default Desktop;