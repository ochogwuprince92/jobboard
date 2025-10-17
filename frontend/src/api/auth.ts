import axiosClient from "./axiosClient";
import type { User } from "@/types";

// Types for authentication
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  email: string;
  phone_number: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email?: string;
  phone_number?: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface ErrorResponse {
  detail?: string;
  [key: string]: any;
}

/**
 * Login with email/phone and password
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const loginData: any = { password: data.password };
    
    // Use email or phone_number based on what's provided
    if (data.email) {
      loginData.email = data.email;
    } else if (data.phone_number) {
      loginData.phone_number = data.phone_number;
    } else {
      throw new Error('Email or phone number is required');
    }
    
    const response = await axiosClient.post("/auth/login/", loginData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    if (response.data.access && response.data.refresh) {
      // Get user details from the user endpoint
      const userResponse = await axiosClient.get("/api/auth/user/", {
        headers: {
          'Authorization': `Bearer ${response.data.access}`,
          'Accept': 'application/json'
        }
      });

      return {
        access: response.data.access,
        refresh: response.data.refresh,
        user: userResponse.data
      };
    }

    throw new Error('Invalid response from server');
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      const errorData: ErrorResponse = error.response.data || {};
      const errorMessage = errorData.detail || 
                         (errorData.non_field_errors && errorData.non_field_errors[0]) ||
                         'Invalid credentials. Please try again.';
      throw new Error(errorMessage);
    }
    throw new Error('Unable to connect to the server. Please check your connection.');
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await axiosClient.post("/auth/registration/", data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // If registration is successful, we might get the user data directly
    // or we might need to fetch it using the returned tokens
    if (response.data.user) {
      return response.data.user;
    } else if (response.data.access && response.data.refresh) {
      const userResponse = await axiosClient.get("/api/auth/user/", {
        headers: {
          'Authorization': `Bearer ${response.data.access}`,
          'Accept': 'application/json'
        }
      });
      return userResponse.data;
    }
    
    throw new Error('Registration successful but unable to fetch user data');
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.response?.data) {
      const errorData: ErrorResponse = error.response.data;
      const errorMessage = errorData.detail || 
                         (errorData.email && errorData.email[0]) ||
                         (errorData.phone_number && errorData.phone_number[0]) ||
                         (errorData.password1 && errorData.password1[0]) ||
                         Object.values(errorData).flat().filter(Boolean).join(' ') ||
                         'Registration failed. Please check your information and try again.';
      throw new Error(errorMessage);
    }
    throw new Error('Unable to connect to the server. Please check your connection.');
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axiosClient.post("/api/auth/password/reset/", { email }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    const errorData: ErrorResponse = error.response?.data || {};
    throw new Error(errorData.detail || 'Failed to send password reset email. Please try again.');
  }
};

/**
 * Reset password with token
 */
export interface ResetPasswordData {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

export const resetPassword = async (data: ResetPasswordData): Promise<void> => {
  try {
    await axiosClient.post("/api/auth/password/reset/confirm/", data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    const errorData: ErrorResponse = error.response?.data || {};
    throw new Error(errorData.detail || 'Failed to reset password. Please try again.');
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await axiosClient.post(
      "/api/auth/token/refresh/", 
      { refresh: refreshToken },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    return {
      access: response.data.access,
      refresh: refreshToken // The refresh token remains the same
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Your session has expired. Please log in again.');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (accessToken: string): Promise<User> => {
  try {
    const response = await axiosClient.get("/api/auth/user/", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw new Error('Failed to fetch user data. Please log in again.');
  }
};

/**
 * Verify email with key
 */
export const verifyEmail = async (key: string): Promise<void> => {
  try {
    await axiosClient.post(
      "/api/auth/registration/verify-email/",
      { key },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    const errorData: ErrorResponse = error.response?.data || {};
    throw new Error(errorData.detail || 'Failed to verify email. The link may be invalid or expired.');
  }
};

/**
 * Logout
 */
export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await axiosClient.post(
      "/api/auth/logout/",
      { refresh: refreshToken },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails on the server, we still want to clear local storage
  }
};
/**
 * Resend email verification
 */
export const resendVerification = async (email: string): Promise<void> => {
  try {
    await axiosClient.post(
      "/api/auth/registration/resend-email/",
      { email },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Resend verification error:', error);
    const errorData: ErrorResponse = error.response?.data || {};
    throw new Error(errorData.detail || 'Failed to resend verification email. Please try again.');
  }
};
