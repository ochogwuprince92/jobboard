"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getJobById } from "@/api/jobs";
import { applyJob } from "@/api/applications";
import { getResumes } from "@/api/resumes";
import { saveJob, unsaveJob } from "@/api/savedJobs";
import { useAuth } from "@/context/AuthContext";
import type { Job, Resume } from "@/types";
import {
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaShare,
  FaBookmark,
  FaBriefcase,
  FaCheckCircle,
  FaArrowLeft,
  FaExternalLinkAlt
} from "react-icons/fa";
import Link from "next/link";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume, setSelectedResume] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobId, setSavedJobId] = useState<number | null>(null);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id as string),
    enabled: !!id,
    onSuccess: (data) => {
      setIsSaved(data.is_saved || false);
    },
  });

  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
    enabled: isAuthenticated,
  });

  const applyMutation = useMutation({
    mutationFn: (data: { job: number; resume: number; cover_letter?: string }) =>
      applyJob(data),
    onSuccess: () => {
      setShowApplyModal(false);
      setCoverLetter("");
      setSelectedResume(null);
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] }); // Refresh job data to update has_applied
      alert("Application submitted successfully!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to submit application");
    },
  });

  const saveMutation = useMutation({
    mutationFn: (jobId: number) => saveJob(jobId),
    onSuccess: (data) => {
      setIsSaved(true);
      setSavedJobId(data.id);
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
    onError: (error: any) => {
      alert("Failed to save job");
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (savedJobId: number) => unsaveJob(savedJobId),
    onSuccess: () => {
      setIsSaved(false);
      setSavedJobId(null);
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
    onError: (error: any) => {
      alert("Failed to unsave job");
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!selectedResume) {
      alert("Please select a resume to apply with");
      return;
    }

    applyMutation.mutate({
      job: parseInt(id as string),
      resume: selectedResume,
      cover_letter: coverLetter.trim() || undefined,
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isSaved && savedJobId) {
      unsaveMutation.mutate(savedJobId);
    } else {
      saveMutation.mutate(parseInt(id as string));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company?.company_name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const isEmployer = user?.is_employer;
  const canApply = !isEmployer && isAuthenticated;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/jobs"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Jobs
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaShare className="mr-2" />
                Share
              </button>
              {canApply && (
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending || unsaveMutation.isPending}
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                    isSaved
                      ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaBookmark className={`mr-2 ${isSaved ? 'text-blue-600' : ''}`} />
                  {saveMutation.isPending || unsaveMutation.isPending
                    ? 'Saving...'
                    : isSaved
                      ? 'Saved'
                      : 'Save Job'
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaBuilding className="mr-2" />
                    <span className="text-lg font-medium">{job.company?.company_name || 'Company Name'}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <FaBriefcase className="mr-2 text-gray-400" />
                      {job.employment_type}
                    </div>
                    {(job.min_salary || job.max_salary) && (
                      <div className="flex items-center">
                        <FaDollarSign className="mr-2 text-gray-400" />
                        {job.min_salary && job.max_salary
                          ? `$${job.min_salary.toLocaleString()} - $${job.max_salary.toLocaleString()}`
                          : job.min_salary
                          ? `From $${job.min_salary.toLocaleString()}`
                          : `Up to $${job.max_salary.toLocaleString()}`
                        }
                      </div>
                    )}
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-gray-400" />
                      Posted {new Date(job.posted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                {canApply && (
                  <div className="ml-6">
                    {job?.has_applied ? (
                      <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg border border-green-200">
                        <FaCheckCircle className="mr-2" />
                        Applied
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (resumes && resumes.length === 0) {
                            router.push("/resumes");
                            return;
                          }
                          setShowApplyModal(true);
                        }}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Apply Now
                        <FaExternalLinkAlt className="ml-2" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">{job.company?.company_name || 'Company Name'}</p>
                  {job.company?.industry && (
                    <p className="text-sm text-gray-600">{job.company.industry}</p>
                  )}
                </div>
                {job.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit Website
                    <FaExternalLinkAlt className="ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Employment Type</span>
                  <span className="font-medium">{job.employment_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                {(job.min_salary || job.max_salary) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary Range</span>
                    <span className="font-medium">
                      {job.min_salary && job.max_salary
                        ? `$${job.min_salary.toLocaleString()} - $${job.max_salary.toLocaleString()}`
                        : job.min_salary
                        ? `From $${job.min_salary.toLocaleString()}`
                        : `Up to $${job.max_salary.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && !job?.has_applied && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for this position</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resume *
                </label>
                <select
                  value={selectedResume || ""}
                  onChange={(e) => setSelectedResume(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={resumesLoading}
                >
                  <option value="">
                    {resumesLoading ? "Loading resumes..." : "Choose a resume..."}
                  </option>
                  {resumes?.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title || `Resume ${resume.id}`} - Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {resumes && resumes.length === 0 && !resumesLoading && (
                  <div className="text-sm text-gray-500 mt-1">
                    <p className="mb-2">No resumes found. Please upload a resume first.</p>
                    <Link
                      href="/resumes"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                      onClick={() => setShowApplyModal(false)}
                    >
                      Go to Resumes →
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applyMutation.isPending || !selectedResume}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
