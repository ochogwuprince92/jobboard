"use client";

import { useState, useEffect } from "react";
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
    error: queryError,
    isRefetching 
  } = useQuery<{ results: Job[] }, unknown>({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
    retry: 1,
  });

  // Handle errors
  useEffect(() => {
    if (isError && queryError) {
      const errorMessage = queryError instanceof Error 
        ? queryError.message 
        : 'Failed to load jobs. Please try again later.';
      setError(errorMessage);
    } else if (!isError) {
      setError(null); // Clear any previous errors on success
    }
  }, [isError, queryError]);

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>

        <div className="mb-8">
          <JobFilter onFilter={handleFilter} />
        </div>
        
        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                id={job.id}
                title={job.title}
                company={job.company}
                company_name={job.company_name}
                location={job.location}
                min_salary={job.min_salary}
                max_salary={job.max_salary}
                employment_type={job.employment_type}
                posted_at={job.posted_at}
                tags={job.tags}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
