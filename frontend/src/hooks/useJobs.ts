"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getJobs, getJobDetail } from "@/api/jobs";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
};

export const useJobDetail = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobDetail(id),
    enabled: !!id,
  });
};
