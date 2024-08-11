// src/auth/AuthService.ts
import axios from "axios";

const API_URL = "https://getmeal-production.up.railway.app/api/user/";

class AuthService {
    async register(email: string, password: string, isOrganization: boolean) {
      try {
        const response = await axios.post(`${API_URL}registration/`, {
          email,
          password,
          is_organization: isOrganization,
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

    async getUser(isOrganization: boolean) {
      try {
        // Отправляем запрос на сервер с параметром is_organization
        const response = await axios.get(`${API_URL}`, {
          params: {
            is_organization: isOrganization,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    }

    setAuthHeader(token: string) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  export default new AuthService();