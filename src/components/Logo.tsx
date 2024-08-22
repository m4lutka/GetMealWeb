import React, {useState} from "react";
import { FunctionComponent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
} from "@mui/material";
import styles from "./Desktop.module.css"
import LogoIco from "../assets/Pics/Logo.svg"

export type DesktopType = {
  className?: string;
};

const Logo: FunctionComponent<DesktopType> = ({ className = "" }) => {
  return (
    <Link to="/main">
    <div className={styles.logoContainer}>
        <img className={styles.logo} alt="Logo" src={LogoIco} />
      </div>
    </Link>
  );
};

export default Logo;