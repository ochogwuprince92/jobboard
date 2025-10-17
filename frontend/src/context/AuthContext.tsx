"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { User } from "@/types";
import { 
  login as apiLogin, 
  register as apiRegister, 
  refreshToken as apiRefreshToken,
  getCurrentUser,
  logout as apiLogout,
  verifyEmail as apiVerifyEmail,
  LoginResponse,
  RegisterData,
  LoginData,
  AuthTokens
} from "@/api/auth";

interface DecodedToken {
  user_id: number;
  email: string;
  exp: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  verifyEmail: (key: string) => Promise<void>;
  updateUser: (user: User) => void;
  refreshAccessToken: () => Promise<string | null>;
  isTokenExpired: (token: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to store auth data
const storeAuthData = (data: { access: string; refresh: string; user: User }) => {
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  localStorage.setItem("user", JSON.stringify(data.user));
};

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedUser = localStorage.getItem("user");

        if (storedAccessToken && storedRefreshToken) {
          // Verify token is not expired
          if (!isTokenExpired(storedAccessToken)) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              // Fetch fresh user data if not in storage
              const userData = await getCurrentUser(storedAccessToken);
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            }
          } else {
            // Token expired, try to refresh
            try {
              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                const userData = await getCurrentUser(newAccessToken);
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
              } else {
                clearAuthData();
              }
            } catch (error) {
              console.error("Failed to refresh token:", error);
              clearAuthData();
            }
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login with email/phone and password
  const login = async (data: LoginData): Promise<LoginResponse> => {
    try {
      // Make the API call
      const response = await apiLogin(data);
      
      // If we get here, login was successful
      const { access, refresh, user } = response;
      
      // Store the authentication data
      storeAuthData({ access, refresh, user });
      
      // Update the state
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(user);
      
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        
        if (status === 400 || status === 401) {
          // Handle authentication errors
          if (data.detail) {
            throw new Error(data.detail);
          } else if (data.non_field_errors) {
            throw new Error(Array.isArray(data.non_field_errors) 
              ? data.non_field_errors[0]
              : data.non_field_errors);
          } else if (data.message) {
            throw new Error(data.message);
          }
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        throw new Error(error.message || 'An error occurred during login.');
      }
      
      // If we get here, it's an unhandled error
      throw error;
    }
  };

  // Register a new user
  const register = async (data: RegisterData): Promise<User> => {
    try {
      const user = await apiRegister(data);
      // After registration, the user needs to verify their email
      // We don't log them in automatically
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout the user
  const logout = async (): Promise<void> => {
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with clearing local data even if API call fails
    } finally {
      clearAuthData();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  // Verify email with key
  const verifyEmail = async (key: string): Promise<void> => {
    try {
      await apiVerifyEmail(key);
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  };

  // Update user data
  const updateUser = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Refresh access token
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (!storedRefreshToken) return null;

    try {
      const { access } = await apiRefreshToken(storedRefreshToken);
      
      // Update the stored access token
      localStorage.setItem("access_token", access);
      setAccessToken(access);
      
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, clear all auth data
      clearAuthData();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      return null;
    }
  }, []);

  const isAuthenticated = !!accessToken && !!user && !isTokenExpired(accessToken);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Don't intercept refresh token requests
        if (config.url?.includes('/token/refresh/')) {
          return config;
        }

        // Add auth header if token exists
        if (accessToken) {
          // Check if token is about to expire (within 5 minutes)
          const decoded = jwtDecode<DecodedToken>(accessToken);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp - currentTime < 300) { // 5 minutes
            try {
              const newAccessToken = await refreshAccessToken();
              if (newAccessToken) {
                config.headers.Authorization = `Bearer ${newAccessToken}`;
              }
            } catch (error) {
              console.error('Failed to refresh token:', error);
              await logout();
              return Promise.reject(error);
            }
          } else {
            config.headers.Authorization = `bearer ${accessToken}`;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken, refreshAccessToken]);

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    updateUser,
    refreshAccessToken,
    isTokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
