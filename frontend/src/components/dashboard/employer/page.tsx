"use client";

import Link from "next/link";
import { useEmployerJobs } from "@/hooks/useJobs";

export default function EmployerDashboard() {
  const { data: jobs, isLoading } = useEmployerJobs();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posted Jobs</h1>
        <Link
          href="/jobs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Post New Job
        </Link>
      </div>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : jobs?.length ? (
        <ul className="space-y-4">
          {jobs.map((job: any) => (
            <li
              key={job.id}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-600">{job.location}</p>
              <Link
                href={`/jobs/${job.id}`}
                className="text-blue-600 text-sm mt-2 inline-block"
              >
                View job →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs posted yet.</p>
      )}
    </div>
  );
}
