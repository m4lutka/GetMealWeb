import { useState } from "react";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await AuthService.login(email, password);
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { email, setEmail, password, setPassword, handleLogin };
};

export default useLogin;
