"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplications } from "@/api/applications";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};

// Hook for user's own applications (filtered by backend based on user role)
export const useMyApplications = () => {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: getApplications,
  });
};
