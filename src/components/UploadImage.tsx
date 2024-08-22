import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@mui/material/Button';
import styles from "../pages/OwnerPage/OwnerPage.module.css";
import refresh from "../assets/Pics/refresh.png";

interface UploadImageProps {
  onImageUpload?: (file: File | null) => void;
}

const UploadImage = forwardRef((props: UploadImageProps, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    if (props.onImageUpload) {
      props.onImageUpload(file);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (props.onImageUpload) {
      props.onImageUpload(null);
    }
  };

  useImperativeHandle(ref, () => ({
    uploadImage: (file: File) => {
      setSelectedFile(file);
      if (props.onImageUpload) {
        props.onImageUpload(file);
      }
    }
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', fontSize: "25px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-button"
      />
      <label htmlFor="upload-button" className={styles.uploadButton}>
        {selectedFile ? selectedFile.name : 'Upload Image'}
      </label>
      <Button
        variant="outlined"
        color="error"
        onClick={handleReset}
        style={{ display: 'flex', alignItems: 'center', padding: '6px', minWidth: "30px" }}
      >
        <img
          alt="Refresh"
          src={refresh}
          style={{ width: '30px', height: '30px'}}
        />
        <div style={{ margin: "0 5px 0 10px", color: "#d76005", opacity: "80%" }}>Reset</div>
      </Button>
    </div>
  );
});

export default UploadImage;
