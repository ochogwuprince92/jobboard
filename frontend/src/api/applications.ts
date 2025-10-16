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

export const getApplicationById = async (id: number): Promise<Application> => {
  const response = await axiosClient.get(`/applications/${id}/`);
  return response.data;
};
