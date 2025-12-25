"use client";

import Link from "next/link";
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock } from "react-icons/fa";
import type { Job } from '@/types';

// Props needed for displaying a job card (subset of Job)
interface JobCardProps {
  id: string | number;
  title: string;
  company_name?: string;
  company?: { company_name: string };
  location: string;
  min_salary?: number;
  max_salary?: number;
  employment_type?: string;
  remote?: boolean;
  posted_at?: string;
  tags?: Array<{ id: number; name: string }>;
}

// Helper to get company name from either source
function getCompanyName(job: JobCardProps): string {
  return job.company_name || job.company?.company_name || 'Unknown Company';
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return '';
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  return `Up to $${max!.toLocaleString()}`;
}

export default function JobCard(props: JobCardProps) {
  const {
    id,
    title,
    company,
    company_name,
    location,
    min_salary,
    max_salary,
    employment_type,
    remote,
    posted_at,
    tags,
  } = props;

  const companyName = getCompanyName({ company, company_name, id, title, location });
  const salaryText = formatSalary(min_salary, max_salary);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/jobs/${id}`} className="block group">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {title}
            </h3>
          </Link>

          <p className="text-gray-600 font-medium mb-3">{companyName}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {location}
            </div>

            {employment_type && (
              <div className="flex items-center">
                <FaBriefcase className="mr-1" />
                {employment_type}
              </div>
            )}

            {remote && (
              <div className="flex items-center">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Remote
                </span>
              </div>
            )}

            {salaryText && (
              <div className="flex items-center">
                <FaDollarSign className="mr-1" />
                {salaryText}
              </div>
            )}

            {posted_at && (
              <div className="flex items-center">
                <FaClock className="mr-1" />
                {new Date(posted_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  {tag.name}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="ml-4">
          <Link
            href={`/jobs/${id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
