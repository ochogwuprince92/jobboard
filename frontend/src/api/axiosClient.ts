import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Create axios instance with base URL from environment variables
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
  responseType: 'json',
  validateStatus: (status) => {
    // Don't throw for 4xx errors, we'll handle them in the response interceptor
    return status < 500;
  }
});

// Request interceptor to attach access token
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") {
      return config;
    }

    // Skip auth for these endpoints
    const publicEndpoints = [
      '/auth/login/',
      '/auth/registration/',
      '/auth/password/reset/',
      '/auth/registration/verify-email/'
    ];

    if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      return config;
    }

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      // No tokens available, proceed without auth
      return config;
    }

    // Check if token is expired
    const isExpired = isTokenExpired(accessToken);
    
    if (!isExpired) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }

    // Token is expired, try to refresh it
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.access) {
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      }
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      // Clear auth data if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Redirect to login or handle as needed
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// Response interceptor with proper typing
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if the response is HTML (indicates a server-side error page)
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html') && !contentType.includes('application/json')) {
      throw new Error('Received HTML response instead of JSON. The server might be experiencing issues.');
    }
    
    // For successful responses, just return the data
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request with the new token
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Clear auth data and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    // Log the error for debugging
    console.error('Axios error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });

    // Handle HTML responses (like 500 error pages)
    const contentType = error.response?.headers?.['content-type'] || '';
    if (contentType.includes('text/html')) {
      throw new Error('The server returned an HTML error page. Please try again later.');
    }

    // Only handle 401 errors (not 403 - forbidden/not verified)
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("Session expired. Please log in again.");
        }

        // Try to refresh the token
        const response = await axios.post<{ access: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/auth/token/refresh/`,
          { refresh: refreshToken },
          { timeout: 5000 } // Add timeout to prevent hanging
        );
        
        const { access } = response.data;
        
        // Update tokens in storage
        localStorage.setItem("access_token", access);
        
        // Update the authorization header
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        
        // Retry the original request
        return axiosClient(originalRequest);
      } catch (error) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    
    // For 403 and other errors, just reject with the error
    return Promise.reject(error);
  }
);

export default axiosClient;
