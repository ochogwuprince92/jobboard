"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
}

interface RecommendedJobsProps {
  jobId: string;
}

export default function RecommendedJobs({ jobId }: RecommendedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/api/jobs/${jobId}/recommendations/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setJobs(data.results || data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommended();
  }, [jobId]);

  if (!jobs.length) return null;

  return (
    <div>
      <h3>Recommended Jobs</h3>
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}
