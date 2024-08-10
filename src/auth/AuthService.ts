// src/auth/AuthService.ts
import axios from "axios";
import { RegisterResponse, LoginResponse } from "./types";

const API_URL = "/api/user/"; // URL вашего API

class AuthService {
    async register(email: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}registration/`, {
          email,
          password,
        });
        return response.data;
      } catch (error) {
        console.error('Error during registration:', error);
        throw error;
      }
    }

    async login(email: string, password: string) {
      try {
        const response = await axios.post(`${API_URL}login/`, {
          email,
          password,
        });
        return response.data;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    }

    setAuthHeader(token: string) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  export default new AuthService();