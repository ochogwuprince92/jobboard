import axiosClient from "./axiosClient";

export interface SavedJob {
  id: number;
  job: number;
  user: number;
  saved_at: string;
  job_title?: string;
  company_name?: string;
  location?: string;
}

export const getSavedJobs = async (): Promise<SavedJob[]> => {
  const response = await axiosClient.get("/saved-jobs/");
  return response.data;
};

export const saveJob = async (jobId: number): Promise<SavedJob> => {
  const response = await axiosClient.post("/saved-jobs/", { job: jobId });
  return response.data;
};

export const unsaveJob = async (savedJobId: number): Promise<void> => {
  const response = await axiosClient.delete(`/saved-jobs/${savedJobId}/`);
  return response.data;
};

export const isJobSaved = async (jobId: number): Promise<boolean> => {
  const savedJobs = await getSavedJobs();
  return savedJobs.some(savedJob => savedJob.job === jobId);
};