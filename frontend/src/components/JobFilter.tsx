"use client";

import { useState } from "react";

interface JobFilterProps {
  onFilter: (filters: Record<string, string>) => void;
}

export default function JobFilter({ onFilter }: JobFilterProps) {
  const [filters, setFilters] = useState({
    location: "",
    title: "",
    company: "",
    industry: "",
    experience: "",
    employment_type: "",
    remote: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input name="title" placeholder="Job Title" value={filters.title} onChange={handleChange} />
      <input name="location" placeholder="Location" value={filters.location} onChange={handleChange} />
      <input name="company" placeholder="Company" value={filters.company} onChange={handleChange} />
      <input name="industry" placeholder="Industry" value={filters.industry} onChange={handleChange} />
      <select name="experience" value={filters.experience} onChange={handleChange}>
        <option value="">Experience Level</option>
        <option value="junior">Junior</option>
        <option value="mid">Mid</option>
        <option value="senior">Senior</option>
      </select>
      <select name="employment_type" value={filters.employment_type} onChange={handleChange}>
        <option value="">Employment Type</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
      </select>
      <select name="remote" value={filters.remote} onChange={handleChange}>
        <option value="">Remote?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <button type="submit" style={{ marginLeft: "0.5rem" }}>Filter</button>
    </form>
  );
}
