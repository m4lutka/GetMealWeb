import { FunctionComponent } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import styles from "./Desktop.module.css";
import Circ1 from "../Pics/Circ1.svg";
import Circ2 from "../Pics/Circ2.svg";
import Circ3 from "../Pics/Circ3.svg";
import Circ4 from "../Pics/Circ4.svg";
import Circ5 from "../Pics/Circ5.svg";
import Circ6 from "../Pics/Circ6.svg";
import Logo from "../Pics/Logo.svg";
export type DesktopType = {
  className?: string;
};

const Desktop: FunctionComponent<DesktopType> = ({ className = "" }) => {
  return (
    <div className={styles.desktopContainer}>
      {/* Добавляем все изображения */}
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
              width: "355px",
            }}
          />
        </div>
        <div className={styles.passwordInputParent}>
          <TextField
            className={styles.passwordInput}
            placeholder="Your Password"
            variant="outlined"
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
            >
              Submit
            </Button>
          </div>
        </div>
      </form>

      <div className={styles.logoContainer}>
        <img className={styles.logo} alt="Logo" src={Logo} />
      </div>
    </div>
  );
};

export default Desktop;