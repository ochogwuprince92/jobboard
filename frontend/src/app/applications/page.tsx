"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { updateApplicationStatus, withdrawApplication } from "@/api/applications";
import { useApplications } from "@/hooks/useApplications";
import type { Application } from "@/types";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaFilter,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import Link from "next/link";

export default function ApplicationsPage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: applications, isLoading, error } = useApplications();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      alert("Application status updated successfully!");
    },
    onError: () => {
      alert("Failed to update application status");
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: number) => withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      alert("Application withdrawn successfully!");
    },
    onError: () => {
      alert("Failed to withdraw application");
    },
  });

  const isEmployer = user?.is_employer;

  // Filter applications based on search and status
  const filteredApplications = applications?.filter((app: Application) => {
    const matchesSearch = !searchTerm ||
      app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <FaClock className="h-4 w-4 text-yellow-500" />;
      case 'Reviewed':
        return <FaEye className="h-4 w-4 text-blue-500" />;
      case 'Accepted':
        return <FaCheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <FaTimesCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FaExclamationTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to view applications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEmployer ? 'Manage Applications' : 'My Applications'}
          </h1>
          <p className="text-gray-600">
            {isEmployer
              ? 'Review and manage applications for your job postings'
              : 'Track the status of your job applications'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={isEmployer ? "Search by job title or applicant..." : "Search by job title or company..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaTimes className="h-4 w-4 mr-1 inline" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Failed to load applications. Please try again.</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app: Application) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBriefcase className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {app.job_title}
                        </h3>
                        <p className="text-gray-600 mb-2">{app.company_name}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <FaCalendarAlt className="h-4 w-4 mr-1" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                          {app.applicant_name && (
                            <div className="flex items-center">
                              <FaUser className="h-4 w-4 mr-1" />
                              {app.applicant_name}
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center">
                          {getStatusIcon(app.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 ml-4">
                    {app.resume && (
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        title="Download resume"
                      >
                        <FaDownload className="h-4 w-4" />
                      </a>
                    )}

                    <Link
                      href={`/jobs/${app.job}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      title="View job details"
                    >
                      <FaEye className="h-4 w-4" />
                    </Link>

                    {/* Employer actions - status update */}
                    {isEmployer && app.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'Accepted' })}
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                          title="Accept application"
                        >
                          <FaCheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'Rejected' })}
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                          title="Reject application"
                        >
                          <FaTimesCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Job seeker actions - withdraw */}
                    {!isEmployer && app.status === 'pending' && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to withdraw this application?")) {
                            withdrawMutation.mutate(app.id);
                          }
                        }}
                        disabled={withdrawMutation.isPending}
                        className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors text-sm"
                        title="Withdraw application"
                      >
                        <FaTrash className="h-4 w-4 mr-1" />
                        {withdrawMutation.isPending ? 'Withdrawing...' : 'Withdraw'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Cover Letter Preview */}
                {app.cover_letter && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-700 line-clamp-3">{app.cover_letter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaBriefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter
                ? "Try adjusting your search criteria."
                : isEmployer
                  ? "Applications for your jobs will appear here."
                  : "Your job applications will appear here."
              }
            </p>
            {!isEmployer && (
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}