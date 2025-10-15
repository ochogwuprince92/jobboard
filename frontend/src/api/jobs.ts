import axiosClient from "./axiosClient";

export const getJobs = (params?: any) =>
  axiosClient.get("jobs/", { params });

export const getJobById = (id: number | string) =>
  axiosClient.get(`jobs/${id}/`);
