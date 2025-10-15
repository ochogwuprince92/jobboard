"use client";

import { useMyApplications } from "@/hooks/useApplications";

export default function SeekerDashboard() {
  const { data: apps, isLoading } = useMyApplications();

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {isLoading ? (
        <p>Loading applications...</p>
      ) : apps?.length ? (
        <ul className="space-y-4">
          {apps.map((app: any) => (
            <li
              key={app.id}
              className="border p-4 rounded-lg hover:shadow-sm transition"
            >
              <h2 className="font-semibold">{app.job_title}</h2>
              <p className="text-gray-600 text-sm">Status: {app.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}
