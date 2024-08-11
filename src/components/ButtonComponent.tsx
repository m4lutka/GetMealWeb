import React from 'react';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/system';
import styles from "../pages/OwnerPage/OwnerPage.module.css"

interface ButtonComponentProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, onClick, sx }) => {
  return (
    <Button
      disableElevation
      variant="contained"
      onClick={onClick}
      sx={{
        textTransform: "none",
        color: "#dcdcdc",
        fontSize: "40px",
        background: "#e96e0e",
        border: "#e96e0e solid 3px",
        borderRadius: "10px",
        transition: "0.3s ease",
        "&:hover": { background: "#d85b0a", border:"#d85b0a solid 3px" },
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        ...sx
      }}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
