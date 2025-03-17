import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust your API base URL
  withCredentials: true, // to handle cookies if you store tokens that way
});

// Add interceptors if you want to handle tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default API;
