"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/api/jobs";
import type { Job } from "@/types";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";

export default function JobsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
  });

  const jobs = data?.results || [];

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
