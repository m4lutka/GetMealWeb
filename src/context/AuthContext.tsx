import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthService from '../auth/AuthService';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isOrganization: boolean;
  checkAuth: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOrganization, setIsOrganization] = useState<boolean>(false);

  // Функция проверки авторизации
  const checkAuth = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      console.log("user ВЫВОДИТ ЭТА: ",user)
      setIsAuthenticated(true);
      setIsOrganization(user.is_organization); // Устанавливаем статус организации
    } catch (error) {
      setIsAuthenticated(false);
      setIsOrganization(false);
    }
  };

  // Функция логина
  const login = async () => {
    // Пример вызова AuthService для логина и установки токена в cookies
    try {
      const response = await AuthService.login('email@example.com', 'password');
      if (response) {
        setIsAuthenticated(true);
        const user = await AuthService.getCurrentUser();
        setIsOrganization(user.is_organization);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Функция логаута
  const logout = () => {
    AuthService.logout(); // Удаление токена из cookies
    setIsAuthenticated(false);
    setIsOrganization(false);
  };

  React.useEffect(() => {
    // Проверка авторизации при монтировании компонента
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isOrganization,checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};