import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error is 401 Unauthorized and not a retry for token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/"}auth/token/refresh/`,
            { refresh: refreshToken }
          );

          if (res.status === 200) {
            const { access, refresh } = res.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            // Update authorization header for the original request
            axiosClient.defaults.headers.common.Authorization = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axiosClient(originalRequest); // Retry original request
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          console.error("Token refresh failed:", refreshError);
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        // No refresh token available, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
