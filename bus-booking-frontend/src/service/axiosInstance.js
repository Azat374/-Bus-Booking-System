// Removed unused import statement

import axios from 'axios';

// Create an Axios instance with the specified baseURL
const axiosInst = axios.create({
  baseURL: 'http://localhost:9090/', // Set your base URL here
});

export { axiosInst }; // Export the axiosInstance for use in other files
