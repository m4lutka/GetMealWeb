import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Desktop from "./components/Desktop"; // Убедитесь, что импорт правильный

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "Default Title";
    let metaDescription = "Default description";

    switch (pathname) {
      case "/":
        title = "Home Page";
        metaDescription = "This is the home page.";
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
    <Routes>
      <Route path="/" element={<Desktop />} /> {/* Используйте компонент Desktop */}
    </Routes>
  );
}

export default App;
