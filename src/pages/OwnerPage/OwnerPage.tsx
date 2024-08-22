import React from 'react';
import TextFieldComponent from '../../components/TextFieldComponent';
import ButtonComponent from '../../components/ButtonComponent';
import styles from './OwnerPage.module.css';
import Circles from '../../components/Circles';
import UploadImage from '../../components/UploadImage';
import Logo from "../../components/Logo"
import AuthService from "../../auth/AuthService";
import { useNavigate } from 'react-router-dom';

const OwnerPage: React.FC = () => {
  const navigate = useNavigate();
  const [image, setImage] = React.useState<File | null>(null);
  const [name, setName] = React.useState<string>('');
  const [user, setUser] = React.useState<any>(null);
  const uploadImageRef = React.useRef<{ uploadImage: (file: File) => void } | null>(null);


  // Функция для обработки вставки изображения из буфера обмена
  const handlePaste = (event: ClipboardEvent) => {
    if (event.clipboardData && event.clipboardData.items) {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && uploadImageRef.current) {
            uploadImageRef.current.uploadImage(file); // Загрузка файла через переданный пропс
          }
        }
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste as any);
    return () => {
      document.removeEventListener('paste', handlePaste as any);
    };
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Здесь можно добавить логику для перенаправления, если пользователь не авторизован
      navigate('/login'); // Перенаправление на страницу входа, если требуется
    }
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  const handleSubmit = async () => {
    try {
      const user = await AuthService.getCurrentUser();

      if (!user.is_active || user.is_organization) {
        throw new Error('User cannot register an organization');
      }

      if (name) {
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
          formData.append('image', image);
        } else {
          formData.append('image', ''); // Добавляем 'null' как строку, если изображение не выбрано
        }

        console.log('FormData being sent:', Array.from(formData.entries()));

        const response = await AuthService.registerOrganization(formData);
      console.log('Server response:', response); // Отладка ответа сервера

      const updatedUser = await AuthService.getCurrentUser();
      console.log('Updated user info:', updatedUser);

      navigate('/organization/dashboard');
    } else {
      console.error('Name is missing');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    if (error instanceof Error) {
      // Отладка ошибки, если она является экземпляром класса Error
      console.error('Error message:', error.message);
    }
  }
};
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register the restaurant</h1>
      <p className={styles.subtitle}>Enter your restaurant name and address to create restaurant</p>

      <TextFieldComponent
        placeholder="Name"
        sx={{
           width: '355px', marginTop: "25px" }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* <TextFieldComponent
        placeholder="Address"
        sx={{
            marginTop: '20px',
            width: '355px',
            borderRadius: "10px",
           }}
      /> */}

      <UploadImage ref={uploadImageRef} onImageUpload={setImage} />

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