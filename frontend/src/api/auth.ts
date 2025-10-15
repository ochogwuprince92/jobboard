import axiosClient from "./axiosClient";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const login = (data: LoginData) =>
  axiosClient.post("login/", data);

export const register = (data: RegisterData) =>
  axiosClient.post("register/", data);

export const verifyEmail = (token: string) =>
  axiosClient.post("verify-email/", { token });

export const forgotPassword = (email: string) =>
  axiosClient.post("forgot-password/", { email });

export const resetPassword = (token: string, password: string) =>
  axiosClient.post("reset-password/", { token, password });
