"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import JobCard from "@/components/JobCard";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
}

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
      {postedJobs.map((job) => <JobCard key={job.id} {...job} />)}
    </div>
  );
}

import NotificationPanel from "@/components/NotificationPanel";

<NotificationPanel userRole="employer" />
