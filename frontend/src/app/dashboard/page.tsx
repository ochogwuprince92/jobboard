"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "job_seeker" | "employer";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me/"); // endpoint for current user
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Unauthorized</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.first_name}</h1>
      {user.role === "job_seeker" ? <JobSeekerPanel /> : <EmployerPanel />}
    </div>
  );
}

function JobSeekerPanel() {
  return (
    <div>
      <h2>Job Seeker Dashboard</h2>
      <ul>
        <li>Saved Jobs</li>
        <li>Applied Jobs</li>
        <li>Recommended Jobs (AI-driven)</li>
        <li>Notifications</li>
      </ul>
    </div>
  );
}

function EmployerPanel() {
  return (
    <div>
      <h2>Employer Dashboard</h2>
      <ul>
        <li>Posted Jobs</li>
        <li>Applicant List per Job</li>
        <li>Notifications of New Applications</li>
      </ul>
    </div>
  );
}
