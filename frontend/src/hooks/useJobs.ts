"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getJobs, getJobById, applyForJob } from "@/api/jobs";
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
    mutationFn: async ({ jobId, ...data }: { jobId: string | number } & Record<string, any>) => {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to apply for job');
      }
      return response.json();
    }
  });

  return mutation;
};
