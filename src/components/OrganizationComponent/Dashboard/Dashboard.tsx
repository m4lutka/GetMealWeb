import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardComp from '../DrawerPanel'
import { useAuth } from '../../../context/AuthContext';
import DrawerPanel from '../DrawerPanel';
import dashImg from "../../../assets/Pics/Dashboard.png"
import NoAccessPage from '../../NoAccessPage';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isOrganization } = useAuth();

  console.log('isAuthenticated:', isAuthenticated);
  console.log('isOrganization:', isOrganization);

  return (
    <div>
     {isAuthenticated && isOrganization ? (
        <DrawerPanel>
          <img
            src={dashImg}
            alt="Dashboard"
            style={{ maxWidth: '100%', maxHeight: '100%',}}
  />
        </DrawerPanel>
      ) : (
        <NoAccessPage />
      )}
    </div>
  );
};

export default Dashboard;