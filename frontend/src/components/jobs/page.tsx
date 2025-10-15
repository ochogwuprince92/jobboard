"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import JobCard from "@/components/jobs/JobCard";
import JobFilter from "@/components/jobs/JobFilter";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
}

export default function JobsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const fetchJobs = async () => {
    const params = new URLSearchParams({ page: page.toString(), ...filters as any });
    const res = await fetch(`/api/jobs/?${params.toString()}`);
    return res.json();
  };

  const { data, isLoading, refetch } = useQuery(["jobs", filters, page], fetchJobs);

  useEffect(() => {
    setPage(1);
    refetch();
  }, [filters]);

  if (isLoading) return <p>Loading jobs...</p>;

  return (
    <div>
      <JobFilter onFilter={setFilters} />

      {data?.results?.length ? (
        data.results.map((job: Job) => <JobCard key={job.id} {...job} />)
      ) : (
        <p>No jobs found.</p>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
