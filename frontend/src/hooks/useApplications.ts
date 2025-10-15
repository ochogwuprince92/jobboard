"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplications } from "@/api/applications";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
  });
};
