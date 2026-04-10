import axios from "axios";

const api = axios.create({
  // This logic automatically switches between your local backend and your Render backend
  baseURL: window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://suretrustg29fsd-backend-qgln.onrender.com/api",
});

// ✅ Attach JWT to every request if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const signupUser = (userData) => api.post("/auth/signup", userData);
export const verifyOtp = (otpData) => api.post("/auth/verify", otpData);
export const loginUser = (cred) => api.post("/auth/login", cred);

// ✅ Ensure email is sent in object format
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (data) => api.post("/auth/reset-password", data);

export default api;