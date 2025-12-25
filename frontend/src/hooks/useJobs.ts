"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getJobs, getJobById } from "@/api/jobs";
import axiosClient from "@/api/axiosClient";
import type { Job } from "@/types";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
};

export const useJobDetail = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

// Hook for employer jobs (current user's jobs)
export const useEmployerJobs = () => {
  return useQuery({
    queryKey: ["employerJobs"],
    queryFn: () => getJobs(),
  });
};

// Hook for applying to jobs
export const useApplyForJob = () => {
  const mutation = useMutation({
    mutationFn: async ({ jobId, resumeId, coverLetter }: { jobId: number; resumeId: number; coverLetter?: string }) => {
      const response = await axiosClient.post("/applications/", {
        job: jobId,
        resume: resumeId,
        cover_letter: coverLetter
      });
      return response.data;
    }
  });

  return mutation;
};
