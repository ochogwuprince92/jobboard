"use client";

import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  employment_type?: string;
  remote?: boolean;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  salary,
  employment_type,
  remote,
}: JobCardProps) {
  return (
    <div
      style={{
        border: "1px solid #d4f5d4",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        background: "#f0fff0",
      }}
    >
      <Link href={`/jobs/${id}`}>
        <h2>{title}</h2>
      </Link>
      <p>{company} - {location}</p>
      {salary && <p>Salary: {salary}</p>}
      <p>Employment: {employment_type || "N/A"} | Remote: {remote ? "Yes" : "No"}</p>
      <Link href={`/jobs/${id}`}>
        <button style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", borderRadius: "4px", background: "#b2ffb2", border: "none" }}>
          View Details
        </button>
      </Link>
    </div>
  );
}
