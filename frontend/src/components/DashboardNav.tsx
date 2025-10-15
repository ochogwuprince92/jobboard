"use client";

import Link from "next/link";

interface DashboardNavProps {
  role: "seeker" | "employer";
}

export default function DashboardNav({ role }: DashboardNavProps) {
  return (
    <nav>
      <ul>
        {role === "seeker" ? (
          <>
            <li><Link href="/dashboard/seeker">Dashboard Home</Link></li>
            <li><Link href="/jobs/saved">Saved Jobs</Link></li>
            <li><Link href="/jobs/applied">Applied Jobs</Link></li>
          </>
        ) : (
          <>
            <li><Link href="/dashboard/employer">Dashboard Home</Link></li>
            <li><Link href="/jobs/posted">Posted Jobs</Link></li>
            <li><Link href="/dashboard/employer/applicants">Applicants</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
