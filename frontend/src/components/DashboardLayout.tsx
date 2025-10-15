"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "seeker" | "employer";
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: "200px", padding: "1rem", borderRight: "1px solid #ccc" }}>
        {userType === "seeker" ? (
          <>
            <p>Dashboard (Job Seeker)</p>
            <ul>
              <li>Saved Jobs</li>
              <li>Applied Jobs</li>
              <li>Recommended Jobs</li>
              <li>Notifications</li>
            </ul>
          </>
        ) : (
          <>
            <p>Dashboard (Employer)</p>
            <ul>
              <li>Posted Jobs</li>
              <li>Applicants</li>
              <li>Notifications</li>
            </ul>
          </>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "1rem" }}>{children}</main>
    </div>
  );
}
