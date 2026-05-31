import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5500/api",
});

// NEW CODE HERE: Auto-attach JWT Token to every single request header
API.interceptors.request.use(
  (config) => {
    const profile = localStorage.getItem("Quevex_user");

    if (profile) {
      const { token } = JSON.parse(profile);
      // Standard Passport/JWT format: "Bearer <YOUR_TOKEN>"
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
