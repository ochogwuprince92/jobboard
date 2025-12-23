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

interface RegisterResponse {
  user?: User | null;
  message: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
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

export const AuthProvider = ({ children, skipInitialLoad }: { children: ReactNode; skipInitialLoad?: boolean }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // `useRouter` requires Next's app router to be mounted; in test
  // environments it can throw. Wrap in try/catch and provide a
  // no-op fallback so unit tests can render this provider.
  let router;
  try {
    router = useRouter();
  } catch (e) {
    // Provide a minimal router shim for tests
    // Only `push` is used by this context.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router = { push: (_: string) => {} } as any;
  }

  // Load user from storage on mount. Tests can opt-out of network refreshes
  // by passing `skipInitialLoad={true}` to the provider. We also keep the
  // previous Jest detection for backwards-compatibility.
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedUser = localStorage.getItem("user");

        if (!storedAccessToken || !storedRefreshToken) {
          // Nothing to load
          return;
        }

  const isJest = typeof process !== 'undefined' && !!process.env.JEST_WORKER_ID;
  // If skipInitialLoad is explicitly provided, respect it. Otherwise fall
  // back to the Jest detection to preserve previous behaviour.
  const shouldSkipRefresh = typeof skipInitialLoad === 'undefined' ? isJest : !!skipInitialLoad;

        // If test mode or explicitly skipped, just load stored values without
        // attempting network requests. This makes unit tests deterministic.
        if (shouldSkipRefresh) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          if (storedUser) setUser(JSON.parse(storedUser));
          return;
        }

        // Otherwise attempt to refresh and fetch current user if needed
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          setRefreshToken(storedRefreshToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const userData = await getCurrentUser(newAccessToken);
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Error loading user:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [skipInitialLoad]);

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
  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await apiRegister(data);
      // After registration, the user needs to verify their email
      // We don't log them in automatically
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout the user (memoized to keep stable reference)
  const logout = useCallback(async (): Promise<void> => {
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
  }, [refreshToken, router]);

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

  // Refresh access token (defined before the initial load effect so it can be used there)
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

  // Memoize the token management functions to maintain stable references
  const handleTokenRefresh = useCallback(async (config: any) => {
    const newToken = await refreshAccessToken();
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`;
      return config;
    }
    await logout();
    return Promise.reject(new Error('Session expired'));
  }, [refreshAccessToken, logout]);

  const handleAuthHeader = useCallback((config: any) => {
    if (!config.headers) {
      config.headers = {};
    }

    // Skip auth for token refresh requests
    if (config.url?.includes('/token/refresh/')) {
      return config;
    }

    // Add auth header if token exists
    if (accessToken) {
      const decodedToken = jwtDecode<DecodedToken>(accessToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = decodedToken.exp - currentTime;

      // If token is about to expire (within 5 minutes), refresh it
      if (timeUntilExpiry < 300) {
        return handleTokenRefresh(config);
      }
      
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  }, [accessToken, handleTokenRefresh]);

  const handle401Response = useCallback(async (error: any) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        await logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }, [refreshAccessToken, logout]);

  // Memoize the interceptor setup
  const setupInterceptors = useCallback(() => {
    const requestInterceptor = axios.interceptors.request.use(
      handleAuthHeader,
      error => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      handle401Response
    );

    return { requestInterceptor, responseInterceptor };
  }, [handleAuthHeader, handle401Response]);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptors = setupInterceptors();

    // Clean up interceptors
    return () => {
      axios.interceptors.request.eject(interceptors.requestInterceptor);
      axios.interceptors.response.eject(interceptors.responseInterceptor);
    };
  }, [setupInterceptors]);

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
