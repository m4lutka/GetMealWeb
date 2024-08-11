import React, {useState} from "react";
import { FunctionComponent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
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

export type DesktopType = {
  className?: string;
};

const Circles: FunctionComponent<DesktopType> = ({ className = "" }) => {
  return (
    <div className={styles.desktopContainer}>
      <img className={`${styles.circ1}`} alt="Circle 1" src={Circ1} />
      <img className={`${styles.circ2}`} alt="Circle 2" src={Circ2} />
      <img className={`${styles.circ3}`} alt="Circle 3" src={Circ3} />
      <img className={`${styles.circ4}`} alt="Circle 4" src={Circ4} />
      <img className={`${styles.circ5}`} alt="Circle 5" src={Circ5} />
      <img className={`${styles.circ6}`} alt="Circle 6" src={Circ6} />
    </div>
  );
};

export default Circles;