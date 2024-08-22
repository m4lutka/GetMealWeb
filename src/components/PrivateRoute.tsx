import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  element: React.ReactElement;
  isOrganizationRequired?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, isOrganizationRequired }) => {
  const { isAuthenticated, isOrganization } = useAuth();
  console.log("isAuthenticated: ",isAuthenticated, "isOrganization: ", isOrganization )

  // Проверка авторизации и прав доступа
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  if (isOrganizationRequired && !isOrganization) {
    return <Navigate to="/main" />;
  }

  return element;
};

export default PrivateRoute;
