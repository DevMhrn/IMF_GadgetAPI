import axios from "axios";

const API_URL = `http://localhost:5000/api`;

const api = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Initialize auth token from localStorage on app start
const user = JSON.parse(localStorage.getItem('user'));
if (user?.token) {
    setAuthToken(user.token);
}

export default api;