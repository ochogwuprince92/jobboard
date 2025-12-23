"use client";

import Link from "next/link";
import { useEmployerJobs } from "@/hooks/useJobs";
import { useApplications } from "@/hooks/useApplications";
import { FaBriefcase, FaUsers, FaPlus, FaEye } from "react-icons/fa";

export default function EmployerDashboard() {
  const { data: jobs, isLoading: jobsLoading } = useEmployerJobs();
  const { data: applications, isLoading: appsLoading } = useApplications();

  // Calculate statistics
  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter(job => job.is_active).length || 0;
  const totalApplications = applications?.length || 0;

  if (jobsLoading || appsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBriefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs Posted</p>
              <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaBriefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaUsers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/jobs/create"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <FaPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Post New Job</p>
              <p className="text-sm text-gray-600">Create a new job listing</p>
            </div>
          </Link>
          <Link
            href="/applications"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaUsers className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Applications</p>
              <p className="text-sm text-gray-600">Review candidate applications</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Job Postings</h2>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all →
          </Link>
        </div>

        {jobs?.length ? (
          <div className="space-y-4">
            {jobs.slice(0, 5).map((job: any) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      job.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-xs text-gray-500">Posted {new Date(job.posted_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {applications?.filter(app => app.job === job.id).length || 0} applications
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaEye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaBriefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
            <Link
              href="/jobs/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
