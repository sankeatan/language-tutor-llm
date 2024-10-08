import axios from 'axios';
import { getTokenFromCookies } from "@/lib/utils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to automatically add the token from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if authentication is enabled via the environment variable
    const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
    // Only add the access token if authentication is enabled
    if (enableAuth) {
      const accessToken = getTokenFromCookies('token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else {
      console.log('Authentication is disabled, skipping token addition.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
