"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/api/jobs";
import type { Job } from "@/types";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";

export default function JobsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { 
    data, 
    isLoading, 
    refetch, 
    isError,
    isRefetching 
  } = useQuery<{ results: Job[] }, unknown>({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load jobs. Please try again later.';
      setError(errorMessage);
    },
    onSuccess: () => {
      setError(null); // Clear any previous errors on success
    },
    retry: 1,
  });

  const jobs = data?.results || [];

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    // No need to call refetch here as changing the filters will trigger a new query
  };

  if (isLoading || isRefetching) {
    return <div className="p-4">Loading jobs...</div>;
  }
  
  if (isError) {
    return (
      <div className="p-4">
        <div className="text-red-600 mb-4">
          {error || 'An error occurred while loading jobs.'}
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!Array.isArray(jobs)) {
    return (
      <div className="p-4 text-red-600">
        Error: Invalid jobs data received
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
      <div className="mb-6">
        <JobFilter onFilter={handleFilter} />
      </div>
      
      {jobs.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              id={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              type={job.type}
              postedDate={job.postedDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
