import axiosClient from "./axiosClient";
import type { Employer } from "@/types";

export const getEmployers = async (): Promise<Employer[]> => {
  const response = await axiosClient.get("/employers/");
  return response.data;
};

export const getEmployerById = async (id: number): Promise<Employer> => {
  const response = await axiosClient.get(`/employers/${id}/`);
  return response.data;
};

export const createEmployerProfile = async (data: Partial<Employer>): Promise<Employer> => {
  const response = await axiosClient.post("/employers/", data);
  return response.data;
};

export const updateEmployerProfile = async (id: number, data: Partial<Employer>): Promise<Employer> => {
  const response = await axiosClient.put(`/employers/${id}/`, data);
  return response.data;
};
