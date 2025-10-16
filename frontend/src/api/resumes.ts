import axiosClient from "./axiosClient";
import type { Resume } from "@/types";

export const uploadResume = async (formData: FormData): Promise<Resume> => {
  const response = await axiosClient.post("/resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getResumes = async (): Promise<Resume[]> => {
  const response = await axiosClient.get("/resumes/");
  return response.data;
};

export const getResumeById = async (id: number): Promise<Resume> => {
  const response = await axiosClient.get(`/resumes/${id}/`);
  return response.data;
};

export const deleteResume = async (id: number) => {
  const response = await axiosClient.delete(`/resumes/${id}/`);
  return response.data;
};
