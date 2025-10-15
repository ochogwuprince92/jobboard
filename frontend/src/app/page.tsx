"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Job {
  id: number;
  title: string;
  company: string;
}

export default function JobsPage() {
  const { data, isLoading, error } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await axios.get("/api/jobs");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading jobs</div>;

  return (
    <ul>
      {data?.map((job) => (
        <li key={job.id}>
          {job.title} at {job.company}
        </li>
      ))}
    </ul>
  );
}
