import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + 'login', { username, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username: string, email: string, password: string, fullName: string, role: string) {
    return axios.post(API_URL + 'register', {
      username,
      email,
      password,
      fullName,
      role,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

export default new AuthService();
