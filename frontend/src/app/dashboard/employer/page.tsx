"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import JobCard from "@/components/JobCard";

import type { Job } from '@/types';

export default function EmployerDashboard() {
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");

      const res = await fetch("/api/employers/me/jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPostedJobs(await res.json());
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <DashboardNav role="employer" />
      <h2>Posted Jobs</h2>
      {postedJobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          title={job.title}
          company={job.company}
          company_name={job.company_name}
          location={job.location}
          employment_type={job.employment_type}
          remote={job.remote}
        />
      ))}
    </div>
  );
}

