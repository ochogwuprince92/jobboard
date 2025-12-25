import axiosClient from "./axiosClient";
import type { Application } from "@/types";

interface ApplyJobData {
  job: number;
  resume: number;
  cover_letter?: string;
}

export const getApplications = async (): Promise<Application[]> => {
  const response = await axiosClient.get("/applications/");
  return response.data;
};

export const applyJob = async (data: ApplyJobData): Promise<Application> => {
  const response = await axiosClient.post("/applications/", data);
  return response.data;
};

export const updateApplicationStatus = async (id: number, status: string): Promise<Application> => {
  const response = await axiosClient.patch(`/applications/${id}/`, { status });
  return response.data;
};

export const withdrawApplication = async (id: number): Promise<void> => {
  const response = await axiosClient.delete(`/applications/${id}/`);
  return response.data;
};
