import React from 'react';
import TextFieldComponent from '../../components/TextFieldComponent';
import ButtonComponent from '../../components/ButtonComponent';
import styles from './OwnerPage.module.css';
import Circles from '../../components/Circles';
import UploadImage from '../../components/UploadImage';
import Logo from "../../components/Logo"
import AuthService from "../../auth/AuthService";

const OwnerPage: React.FC = () => {
  const handleSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register the restaurant</h1>
      <p className={styles.subtitle}>Enter your restaurant name and address to create restaurant</p>

      <TextFieldComponent
        placeholder="Name"
        sx={{
           width: '355px', marginTop: "25px" }}
      />
      {/* <TextFieldComponent
        placeholder="Address"
        sx={{
            marginTop: '20px',
            width: '355px',
            borderRadius: "10px",
           }}
      /> */}

      <UploadImage />

      <div className={styles.buttonWrapper}>
        <ButtonComponent
          text="Submit"
          onClick={handleSubmit}
          sx={{ marginTop: '-10px', width: '300px', color: "#fff", height: "64px" }}
        />
      </div>
      <Circles/>
      <Logo />
    </div>
  );
};

export default OwnerPage;