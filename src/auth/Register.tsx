import { useState } from "react";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";

const useRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isOrganization, setIsOrganization] = useState(false);

  const handleRegister = async () => {
    try {
      await AuthService.register(email, password, isOrganization);
      navigate("/main");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return { email, setEmail, password, setPassword, handleRegister };
};

export default useRegister;