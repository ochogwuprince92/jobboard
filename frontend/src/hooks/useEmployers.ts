"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployers, getEmployerMe } from "@/api/employers";

export const useEmployers = () => {
  return useQuery({
    queryKey: ["employers"],
    queryFn: getEmployers,
  });
};

export const useEmployerMe = () => {
  return useQuery({
    queryKey: ["employer-me"],
    queryFn: getEmployerMe,
  });
};
