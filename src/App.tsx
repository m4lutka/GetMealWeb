import React from "react";
import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Desktop from "./components/Desktop";
import OwnerPage from './pages/OwnerPage/OwnerPage';
import Main from "./pages/main/Main";
import Login from "./pages/Login/LoginPage"
import Profile from "./pages/Profile/Profile"
import Dashboard from "./components/OrganizationComponent/Dashboard/Dashboard"
import Header from "./components/header"; // Ваш авторизованный заголовок
import HeaderUNREG from "./components/headerUNREG"; // Ваш неавторизованный заголовок
import { useAuth } from "./context/AuthContext";
import Restaurants from './components/OrganizationComponent/Restaurants/Restaurants';
import NewRestaurant from './components/OrganizationComponent/NewRestaurant/NewRestaurant';
import Menus from './components/OrganizationComponent/Menus/Menus'
import Items from "./components/OrganizationComponent/Items/Items";
import ItemsTemp from "./components/OrganizationComponent/Items/ItemsTemp";

function App() {
  const { isAuthenticated } = useAuth();
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "GetMeal Registration";
    let metaDescription = "GetMeal Registration";

    switch (pathname) {
      case "/":
        title = "GetMeal";
        metaDescription = "Getmeal";
        break;
      default:
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);


  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/Registration" />} />
      <Route path="/Registration" element={<Desktop />} /> {/* Используйте компонент Desktop */}
      <Route path="/main" element={<Main />} />
      <Route path="/ownerPage" element={<OwnerPage />} />
      <Route path="/Login" element={<Login /> } />
      <Route path="/Profile" element={<Profile/>} />
      <Route path="organization/Dashboard" element={<Dashboard />} />
      <Route path="/organization/Restaurants" element={<Restaurants />} />
      <Route path="/organization/Restaurants/NewRestaurant" element={<NewRestaurant />} />
      <Route path="/organization/Menus" element={<Menus />} />
      <Route path="/organization/ItemsTemp" element={<ItemsTemp />} />
    </Routes>
    </>
  );
}

export default App;
