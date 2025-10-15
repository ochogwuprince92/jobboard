"use client";

import Link from "next/link";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
}

export default function JobCard({ id, title, company, location, salary, type }: JobCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
      <h3>{title}</h3>
      <p>{company} - {location}</p>
      {salary && <p>Salary: {salary}</p>}
      {type && <p>Type: {type}</p>}
      <Link href={`/jobs/${id}`} style={{ color: "#28a745", fontWeight: "bold" }}>View Details</Link>
    </div>
  );
}
