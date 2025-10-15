import axiosClient from "./axiosClient";

export const getEmployerProfile = () =>
  axiosClient.get("employers/me/");

export const getEmployerJobs = () =>
  axiosClient.get("jobs/", { params: { employer: "me" } });
