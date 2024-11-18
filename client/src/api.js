// api.js
import axios from 'axios';

// Create an axios instance (optional)
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust your API URL accordingly
});

export default api;
