"use client";

import { useQuery } from "@tanstack/react-query";
import { getResumes } from "@/api/resumes";

export const useResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
};
