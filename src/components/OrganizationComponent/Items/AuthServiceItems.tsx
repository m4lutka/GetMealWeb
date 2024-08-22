import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://getmeal-production.up.railway.app/api/user/";
const API_URL_ORG = "https://getmeal-production.up.railway.app/api/";

class AuthService {
  private axiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.setToken(newToken);

            this.isRefreshing = false;
            this.refreshSubscribers.forEach(callback => callback(newToken));
            this.refreshSubscribers = [];

            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (err) {
            console.error('Error handling 401 error:', err);
            this.isRefreshing = false;
            this.logout();
            throw err;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | undefined {
    return Cookies.get('userToken');
  }

  private setToken(token: string) {
    console.log('Setting token in cookies:', token);
    Cookies.set('userToken', token, { expires: 7, secure: false, sameSite: 'Strict' });
  }

  private removeToken() {
    console.log('Removing token from cookies');
    Cookies.remove('userToken');
  }

  private getRefreshToken(): string | undefined {
    return Cookies.get('refreshToken');
  }

  private setRefreshToken(token: string) {
    Cookies.set('refreshToken', token, { expires: 7, secure: false, sameSite: 'Strict' });
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
      const { access } = response.data;
      this.setToken(access);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await this.axiosInstance.get(`${API_URL}me/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  async logout() {
    this.removeToken();
    // Optionally redirect the user or perform additional cleanup
  }

  async register(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}registration/`, { email, password });
      const { access, refresh } = response.data;
      this.setToken(access);
      this.setRefreshToken(refresh);
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}login/`, { email, password });
      const { access, refresh } = response.data;
      this.setToken(access);
      this.setRefreshToken(refresh);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async registerOrganization(formData: FormData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_URL_ORG}organization/registration/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error during organization registration:', error);
      throw error;
    }
  }

  async createNewRestaurant(formData: FormData) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_URL_ORG}organization/new-restaurant/`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating new restaurant:', error);
      throw error;
    }
  }

  async getRestaurants() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL_ORG}organization/restaurants/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  async createRestaurant(organizationId: string, restaurantData: any) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
        `${API_URL}${organizationId}/new-restaurant/`,
        restaurantData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

  async createMenu(menuData: { name: string; description: string; restaurant: string[] }) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_URL_ORG}menu/create/`, menuData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  async createCategory(categoryData: { name: string; description: string; menu: number }) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`${API_URL_ORG}menu/category/create`, categoryData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async checkMenuNameExists(menuName: string): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL_ORG}menu/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const menus = response.data as { id: number; name: string; description: string }[];
      return menus.some(menu => menu.name.toLowerCase() === menuName.toLowerCase());
    } catch (error) {
      console.error('Error checking menu name existence:', error);
      throw error;
    }
  }

  async getMenus(): Promise<{ id: number; name: string; description: string }[]> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL_ORG}menu/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw error;
    }
  }

  async getCategories(): Promise<{ id: number; name: string }[]> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      // 1. Получаем список всех меню для организации
      const menusResponse = await axios.get<{ id: number }[]>(`${API_URL_ORG}menu/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // 2. Извлекаем идентификаторы меню
      const menuIds: number[] = menusResponse.data.map((menu) => menu.id);

      // 3. Получаем категории для каждого меню
      const categoriesPromises = menuIds.map(async (menuId: number) => {
        const response = await axios.get<{ id: number; name: string }[]>(`${API_URL_ORG}menu/category/${menuId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data.map((category) => ({
          id: category.id,
          name: category.name
        }));
      });

      // Собираем все категории
      const categoriesArrays = await Promise.all(categoriesPromises);
      const allCategories = categoriesArrays.flat();

      return allCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      const token = this.getToken();
      if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.delete(`${API_URL_ORG}menu/category/${categoryId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
    }

    async getAllRestaurants() {
      try {
        const response = await axios.get(`${API_URL_ORG}restaurant/all`);
        return response;
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
      }
    }

    async createItem(itemData: { name: string; description: string; categoryId: number[]; ingredients: string[] }) {
      try {
        const token = this.getToken();
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.post(`${API_URL_ORG}menu/item/create`, itemData);
        console.log('Response from server:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating item:', error);
        throw error;
      }
    }

    async checkItemNameUnique(itemName: string): Promise<boolean> {
      try {
        const token = this.getToken();
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL_ORG}menu/item/check-name`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { name: itemName }
        });

        return response.data.exists;
      } catch (error) {
        console.error('Error checking item name uniqueness:', error);
        throw error;
      }
    }


  }

  export default new AuthService();