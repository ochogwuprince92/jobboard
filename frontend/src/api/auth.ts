import axiosClient from "./axiosClient";
import type { LoginResponse, RegisterData } from "@/types";

interface LoginData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  otp: string;
  new_password: string;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosClient.post("/login/", data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await axiosClient.post("/register/", data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailData) => {
  const response = await axiosClient.post("/verify-email/", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosClient.post("/forgot-password/", { email });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await axiosClient.post("/reset-password/", data);
  return response.data;
};
