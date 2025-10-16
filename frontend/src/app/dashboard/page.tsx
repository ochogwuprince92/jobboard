"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <Loading fullScreen message="Loading dashboard..." />;
  
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Welcome, {user?.first_name}!</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {user?.email}
      </p>
      {user?.is_employer ? <EmployerPanel /> : <JobSeekerPanel />}
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
