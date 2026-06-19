import axios from 'axios';
import type { CurrentUser, Role } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

class AuthService {
  async login(username: string, password: string) {
    const response = await api.post<CurrentUser>('/auth/login', { username, password });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(username: string, email: string, password: string, fullName: string, role: Role = 'USER') {
    return api.post('/auth/register', { username, email, password, fullName, role });
  }

  getCurrentUser(): CurrentUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  }

  isAuthenticated() {
    return Boolean(this.getCurrentUser()?.token);
  }

  isAdmin() {
    return this.getCurrentUser()?.role === 'ADMIN';
  }
}

const authService = new AuthService();
export default authService;
