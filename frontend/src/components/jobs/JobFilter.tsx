"use client";

import { useState } from "react";

interface JobFilterProps {
  onFilter: (filters: Record<string, string>) => void;
}

export default function JobFilter({ onFilter }: JobFilterProps) {
  const [filters, setFilters] = useState({
    location: "",
    title: "",
    salary: "",
    experience: "",
    type: "",
    industry: "",
    company: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
      <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
      <input name="title" placeholder="Job Title" value={filters.title} onChange={handleChange} />
      <input name="salary" placeholder="Salary" value={filters.salary} onChange={handleChange} />
      <input name="experience" placeholder="Experience" value={filters.experience} onChange={handleChange} />
      <select name="type" value={filters.type} onChange={handleChange}>
        <option value="">Employment Type</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
      </select>
      <input name="industry" placeholder="Industry" value={filters.industry} onChange={handleChange} />
      <input name="company" placeholder="Company" value={filters.company} onChange={handleChange} />
    </div>
  );
}
