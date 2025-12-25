import axiosClient from "./axiosClient";
import axios from "axios";
import type { User } from "@/types";

// Types for authentication
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user?: User | null;
}

// Import the RegisterData interface from types to keep them in sync
import type { RegisterData as RegisterFormData } from '@/types';
export type { RegisterData } from '@/types';

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
  [key: string]: unknown;
}

/**
 * Login with email/phone and password
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const loginData: Record<string, string> = { password: data.password };
    
    // Use email or phone_number based on what's provided
    if (data.email) {
      loginData.email = data.email;
    } else if (data.phone_number) {
      loginData.phone_number = data.phone_number;
    } else {
      throw new Error('Email or phone number is required');
    }
    
    // Use a direct axios request so we can reliably inspect status + data
    // Try both possible backend endpoints (/auth/login/ and /api/auth/login/)
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const candidates = [
      `${base.replace(/\/$/, '')}/auth/login/`,
      `${base.replace(/\/$/, '')}/api/auth/login/`
    ];

    let rawResponse: { status: number; data: unknown } | null = null;
    for (const url of candidates) {
      try {
        rawResponse = await axios.post(url, loginData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          // Do not throw for 4xx so we can inspect body
          validateStatus: () => true
        });

        // If this endpoint returned anything other than a network error,
        // stop trying other candidates.
        if (rawResponse) break;
      } catch {
        // Try next candidate
        rawResponse = null;
      }
    }

    if (!rawResponse) {
      throw new Error('Unable to connect to authentication server.');
    }

    const status = rawResponse.status;
    const responseData = rawResponse.data as unknown;

    // Handle 4xx errors with backend-provided messages
    if (status >= 400 && status < 500) {
      // Prefer common DRF-style fields
      const data = responseData as Record<string, unknown>;
      const errMsg = data?.error || data?.detail || (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : undefined) || data?.message || responseData || 'Invalid credentials. Please try again.';
      throw new Error(String(errMsg));
    }

    // 2xx success — expect tokens
    if (status >= 200 && status < 300 && responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;
      if (data.access && data.refresh) {
        let userObj: User | null = (data as { user?: User }).user || null;
        if (!userObj) {
          // Fetch user via axiosClient (which adds auth header if available)
          try {
            const userResponse = await axiosClient.get('/auth/user/', {
              headers: {
                'Authorization': `Bearer ${data.access as string}`,
                'Accept': 'application/json'
              }
            });
            userObj = userResponse.data as User;
          } catch (uErr) {
            console.error('Failed to fetch user after login:', uErr);
            throw new Error('Logged in but failed to fetch user profile. Please try again.');
          }
        }

        return {
          access: data.access as string,
          refresh: data.refresh as string,
          user: userObj as User
        };
      }
    }

    // Any other shape is unexpected
    throw new Error('Invalid response from server.');
  } catch (error: unknown) {
    console.error('Login error:', error);
    // If this error is an axios-style error with response, extract message
    const axiosError = error as { response?: { data?: unknown } };
    if (axiosError.response) {
      const errorData = (axiosError.response.data as ErrorResponse) || {};
      const errorMessage = errorData.detail ||
                         (Array.isArray(errorData.non_field_errors) && errorData.non_field_errors.length > 0 && errorData.non_field_errors[0]) ||
                         'Invalid credentials. Please try again.';
      throw new Error(errorMessage);
    }

    // If a plain Error was thrown earlier with a useful message (e.g., we
    // constructed it when parsing a 4xx), preserve that message instead of
    // replacing it with a generic network error.
    const errorObj = error as { message?: string };
    if (errorObj?.message && typeof errorObj.message === 'string' && errorObj.message.length > 0) {
      throw new Error(errorObj.message);
    }

    throw new Error('Unable to connect to the server. Please check your connection.');
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterFormData): Promise<RegisterResponse> => {
  try {
    // Transform the data to match backend expectations
    const registrationData = {
      email: data.email,
      phone_number: data.phone_number || '',
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      confirm_password: data.confirm_password
    };

    console.log('Sending registration request with data:', registrationData);
    
    console.log('Registration data being sent:', JSON.stringify(registrationData, null, 2));
    
    const response = await axiosClient.post("/auth/registration/", registrationData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Don't throw on non-200 responses, let us handle them
      validateStatus: () => true
    });

    console.log('Raw registration response:', response);

    // Normalize response to handle both direct data and axios response object
    const parsed = response && typeof response === 'object' && 'data' in response ? response.data : response;
    
    console.log('Parsed registration response:', parsed);

    // Always return a successful response if we got a parsed object with any recognized fields
    if (parsed && typeof parsed === 'object') {
      // First check for validation errors
      const possibleErrorFields = [
        'non_field_errors',
        'detail',
        'email',
        'phone_number',
        'password1',
        'password',
        'error'
      ];

      const errors = possibleErrorFields
        .map(field => {
          const value = (parsed as Record<string, unknown>)[field];
          if (value) {
            return Array.isArray(value) ? value[0] : String(value);
          }
          return null;
        })
        .filter(Boolean);

      if (errors.length > 0 && !parsed.user && !parsed.access) {
        // Attach the backend response to the error so callers can inspect it
        const err = new Error(errors[0]);
        (err as Error & { response: { data: unknown } }).response = { data: parsed };
        throw err;
      }

      // Case 1: Response has message field (current backend format)
      if (typeof parsed.message === 'string') {
        return {
          user: parsed.user || null,
          message: parsed.message
        };
      }

      // Case 2: Response has user field but no message
      if (parsed.user) {
        return {
          user: parsed.user,
          message: 'Registration successful.'
        };
      }

      // Case 3: Response has tokens (legacy format)
      if (parsed.access && parsed.refresh) {
        const userResponse = await axiosClient.get("/auth/user/", {
          headers: {
            'Authorization': `Bearer ${parsed.access}`,
            'Accept': 'application/json'
          }
        });
        return {
          user: userResponse.data as User,
          message: 'Registration successful.'
        };
      }

      // Case 4: Response is empty object or has no recognized fields
      // Instead of throwing an error, assume success with verification required
      return {
        user: null,
        message: 'Registration successful. Please check your email to verify your account.'
      };
    }

    // If response is null/undefined, still treat as success
    return {
      user: null,
      message: 'Registration successful. Please check your email to verify your account.'
    };

  } catch (error: unknown) {
    console.error('Registration error:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    // If we have a response with data, try to extract a meaningful error message
    const axiosError = error as { response?: { data?: unknown } };
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data as ErrorResponse;
      console.log('Backend error response:', JSON.stringify(errorData, null, 2));

      // Try to extract error message in order of priority
      const errorMessage = 
        errorData.detail ||
        errorData.error ||
        (Array.isArray(errorData.email) && `Email: ${errorData.email[0]}`) ||
        (Array.isArray(errorData.phone_number) && `Phone: ${errorData.phone_number[0]}`) ||
        (Array.isArray(errorData.password) && `Password: ${errorData.password[0]}`) ||
        (Array.isArray(errorData.confirm_password) && `Confirm password: ${errorData.confirm_password[0]}`) ||
        (Array.isArray(errorData.non_field_errors) && errorData.non_field_errors[0]) ||
        Object.entries(errorData)
          .filter(([, value]) => value && typeof value !== 'object')
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ') ||
        'Registration failed. Please check your information and try again.';
      
      throw new Error(errorMessage);
    }
    
    // If we got here with a response but no data, it's probably a network error
    if (axiosError.response) {
      const status = (axiosError.response as { status?: number }).status;
      throw new Error(`Server error: ${status}. Please try again.`);
    }
    
    // If the error has a message (e.g., from our validation), use it
    const errorObj = error as { message?: string };
    if (errorObj.message) {
      throw error;
    }
    
    // Final fallback
    throw new Error('Unable to connect to the server. Please check your connection.');
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axiosClient.post("/auth/password/reset/", { email }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    const errorData: ErrorResponse = (error as { response?: { data?: ErrorResponse } })?.response?.data || {};
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
    await axiosClient.post("/auth/password/reset/confirm/", data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    const errorData: ErrorResponse = (error as { response?: { data?: ErrorResponse } })?.response?.data || {};
    throw new Error(errorData.detail || 'Failed to reset password. Please try again.');
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  try {
    const response = await axiosClient.post(
      "/auth/token/refresh/",
      { refresh: refreshToken },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    // axiosClient returns parsed data
    return {
      access: (response.data as { access: string }).access,
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
    const response = await axiosClient.get("/auth/user/", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    // axiosClient returns parsed data
    return response.data as User;
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
      "/auth/registration/verify-email/",
      { key },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    const errorData: ErrorResponse = (error as { response?: { data?: ErrorResponse } })?.response?.data || {};
    throw new Error(errorData.detail || 'Failed to verify email. The link may be invalid or expired.');
  }
};

/**
 * Logout
 */
export const logout = async (refreshToken: string): Promise<void> => {
  try {
    await axiosClient.post(
      "/auth/logout/",
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
      "/auth/registration/resend-email/",
      { email },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    const errorData: ErrorResponse = (error as { response?: { data?: ErrorResponse } })?.response?.data || {};
    throw new Error(errorData.detail || 'Failed to resend verification email. Please try again.');
  }
};