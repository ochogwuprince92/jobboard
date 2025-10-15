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

export default function SeekerDashboard() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");

      const savedRes = await fetch("/api/jobs/saved/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedRes = await fetch("/api/applications/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs(await savedRes.json());
      setAppliedJobs(await appliedRes.json());
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <DashboardNav role="seeker" />
      <h2>Saved Jobs</h2>
      {savedJobs.map((job) => <JobCard key={job.id} {...job} />)}

      <h2>Applied Jobs</h2>
      {appliedJobs.map((job) => <JobCard key={job.id} {...job.job} />)}
    </div>
  );
}
import NotificationPanel from "@/components/NotificationPanel";

<NotificationPanel userRole="seeker" />
