import axios from 'axios';

// Define your base URL here once
const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default axiosInstance;