"use client";

import { useMyApplications } from "@/hooks/useApplications";
import { useAuth } from "@/context/AuthContext";
import { Application } from "@/types";
import Link from "next/link";
import { FaBriefcase, FaCheckCircle, FaClock, FaEye } from "react-icons/fa";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useMyApplications();

  // Calculate statistics
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === 'Pending').length || 0;
  const reviewedApplications = applications?.filter(app => app.status === 'Reviewed').length || 0;

  if (isLoading) {
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
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">{reviewedApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/jobs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaEye className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Browse Jobs</p>
              <p className="text-sm text-gray-600">Find your next opportunity</p>
            </div>
          </Link>
          <Link
            href="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaBriefcase className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Update Profile</p>
              <p className="text-sm text-gray-600">Keep your profile current</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all →
          </Link>
        </div>

        {applications?.length ? (
          <div className="space-y-4">
            {applications.slice(0, 5).map((app: Application) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{app.job_title}</h3>
                  <p className="text-sm text-gray-600">{app.company_name}</p>
                  <p className="text-xs text-gray-500">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : app.status === 'Reviewed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaBriefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven&apos;t applied to any jobs yet.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
