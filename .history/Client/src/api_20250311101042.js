import axios from "axios";
import { logoutUser } from "./Redux/actions/authActions";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Automatically add access token to every request
const token = localStorage.getItem("token");
API.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - refresh access token on 401 error
API.interceptors.response.use(
  (response) => response, // success => return response
  async (error) => {
    const originalRequest = error.config;

    // If 401 and this is the first retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Optional: Logout the user if no refreshToken is available
          return Promise.reject(error);
        }

        // Request new access token
        const { data } = await axios.post(
          "http://localhost:8000/refresh-token",
          {
            refreshToken,
          }
        );

        const newAccessToken = data.Result.accessToken;

        // Update access token in storage
        localStorage.setItem("token", newAccessToken);

        // Update Authorization headers
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Retry the original failed request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired or invalid. Logging out...");
        // Optional: Logout user, redirect to login
        // logoutUser(); or dispatch logout thunk
        dispatch(logoutUser());
        navigate("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
