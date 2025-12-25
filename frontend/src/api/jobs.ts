import axiosClient from "./axiosClient";
import type { Job, PaginatedResponse } from "@/types";

export const getJobs = async (params?: Record<string, unknown>): Promise<PaginatedResponse<Job>> => {
  const response = await axiosClient.get("/jobs/", { params });
  return response.data;
};

export const getJobById = async (id: number | string): Promise<Job> => {
  const response = await axiosClient.get(`/jobs/${id}/`);
  return response.data;
};

export const createJob = async (data: Partial<Job>) => {
  const response = await axiosClient.post("/jobs/", data);
  return response.data;
};

export const updateJob = async (id: number, data: Partial<Job>) => {
  const response = await axiosClient.put(`/jobs/${id}/`, data);
  return response.data;
};

export const deleteJob = async (id: number) => {
  const response = await axiosClient.delete(`/jobs/${id}/`);
  return response.data;
};
