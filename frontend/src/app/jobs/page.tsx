"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  employment_type?: string;
  remote?: boolean;
}

export default function JobsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/jobs/?${params.toString()}`);
      return res.data;
    },
  });

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    refetch();
  };

  if (isLoading) return <div>Loading jobs...</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Job Listings</h1>
      <JobFilter onFilter={handleFilter} />
      {jobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        jobs.map((job: Job) => <JobCard key={job.id} {...job} />)
      )}
    </div>
  );
}
