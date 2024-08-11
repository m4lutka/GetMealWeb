import React from 'react';
import TextField from '@mui/material/TextField';
import { SxProps } from '@mui/system';
import styles from "../styles/global.css"

interface TextFieldComponentProps {
  placeholder: string;
  type?: string;
  sx?: SxProps;
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ placeholder, type = 'text', sx }) => {
  return (
    <TextField
    label={placeholder}
      type={type}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#e96e0e",
            borderWidth: "2px",
            borderRadius: "10px"
          },
          "&:hover fieldset": {
            borderColor: "#e96e0e",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#e96e0e",
            borderWidth: "3px",
          },
        },
        "& .MuiInputLabel-root": {
          color: "rgba(0, 0, 0, 0.5)",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#e96e0e",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          padding: "0 8px",
        },
        ...sx
      }}
    />
  );
};

export default TextFieldComponent;