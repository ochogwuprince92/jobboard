import axiosClient from "./axiosClient";

export const getApplications = () =>
  axiosClient.get("applications/");

export const applyJob = (jobId: number) =>
  axiosClient.post("applications/", { job: jobId });
