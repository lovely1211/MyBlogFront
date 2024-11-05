import axios from 'axios';

// Define your base URL here once
const API_URL = 'https://myblogbackend-l3xw.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default axiosInstance;