import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

