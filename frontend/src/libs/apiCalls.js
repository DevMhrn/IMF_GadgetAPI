import axios from "axios";

//add the URL of the backend API from the .env file

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

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