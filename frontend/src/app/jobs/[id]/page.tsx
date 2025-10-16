"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJobById } from "@/api/jobs";
import type { Job } from "@/types";

export default function JobDetailPage() {
  const { id } = useParams();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading job details...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{job.title}</h1>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
      {job.employment_type && <p><strong>Type:</strong> {job.employment_type}</p>}
      {job.remote !== undefined && (
        <p><strong>Remote:</strong> {job.remote ? "Yes" : "No"}</p>
      )}
      <hr />
      <h2>Description</h2>
      <p>{job.description}</p>

      {job.requirements && (
        <>
          <h2>Requirements</h2>
          <p>{job.requirements}</p>
        </>
      )}
    </div>
  );
}
