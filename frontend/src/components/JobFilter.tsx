"use client";

import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaBuilding, FaIndustry, FaUserTie, FaBriefcase, FaGlobe } from "react-icons/fa";

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
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters); // Apply filters immediately on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      title: "",
      company: "",
      industry: "",
      experience: "",
      employment_type: "",
      remote: "",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Job Title */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              name="title"
              placeholder="Job title or keywords"
              value={filters.title}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Company */}
          <div className="relative">
            <FaBuilding className="absolute left-3 top-3 text-gray-400" />
            <input
              name="company"
              placeholder="Company"
              value={filters.company}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Industry */}
          <div className="relative">
            <FaIndustry className="absolute left-3 top-3 text-gray-400" />
            <input
              name="industry"
              placeholder="Industry"
              value={filters.industry}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Experience Level */}
          <div className="relative">
            <FaUserTie className="absolute left-3 top-3 text-gray-400" />
            <select
              name="experience"
              value={filters.experience}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Experience Level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="relative">
            <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
            <select
              name="employment_type"
              value={filters.employment_type}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Employment Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Remote Work */}
          <div className="relative">
            <FaGlobe className="absolute left-3 top-3 text-gray-400" />
            <select
              name="remote"
              value={filters.remote}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Remote Work</option>
              <option value="true">Remote</option>
              <option value="false">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
