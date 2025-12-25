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
  company_name?: string;
}

interface ApiJob {
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

      const savedData = await savedRes.json();
      const appliedData = await appliedRes.json();
      
      // Transform company field to company_name for JobCard compatibility
      setSavedJobs(savedData.map((job: ApiJob) => ({ ...job, company_name: job.company })));
      setAppliedJobs(appliedData.map((job: ApiJob) => ({ ...job, company_name: job.company })));
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <DashboardNav role="seeker" />
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        savedJobs.map((job) => (
          <JobCard 
            key={job.id} 
            id={job.id}
            title={job.title}
            company_name={job.company_name}
            location={job.location}
            employment_type={job.type}
          />
        ))
      ) : (
        <p>No saved jobs yet.</p>
      )}

      <h2>Applied Jobs</h2>
      {appliedJobs.length > 0 ? (
        appliedJobs.map((application) => (
          <JobCard 
            key={application.id} 
            id={application.id}
            title={application.title}
            company_name={application.company_name}
            location={application.location}
            employment_type={application.type}
          />
        ))
      ) : (
        <p>No applied jobs yet.</p>
      )}
    </div>
  );
}
