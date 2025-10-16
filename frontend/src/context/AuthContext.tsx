"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types";

interface DecodedToken {
  user_id: number;
  email: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateTokens: (access: string, refresh: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tokens and user from localStorage on mount
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");
    const storedUser = localStorage.getItem("user");

    if (storedAccessToken && storedRefreshToken) {
      try {
        // Verify token is not expired
        const decoded = jwtDecode<DecodedToken>(storedAccessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          // Token expired, clear storage
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (access: string, refresh: string, userData: User) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const updateTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        accessToken, 
        refreshToken, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        updateUser,
        updateTokens 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
