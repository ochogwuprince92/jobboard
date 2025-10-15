import axiosClient from "./axiosClient";

export const uploadResume = (formData: FormData) =>
  axiosClient.post("resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResumes = () => axiosClient.get("resumes/");
