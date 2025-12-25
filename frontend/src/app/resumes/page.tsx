"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getResumes, uploadResume, deleteResume } from "@/api/resumes";
import { useAuth } from "@/context/AuthContext";
import type { Resume } from "@/types";
import ResumeCard from "@/components/ResumeCard";
import {
  FaPlus,
  FaUpload,
  FaFileAlt,
  FaSpinner
} from "react-icons/fa";

export default function ResumesPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
    enabled: isAuthenticated,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => uploadResume(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setTitle("");
      alert("Resume uploaded successfully!");
    },
    onError: (error: unknown) => {
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to upload resume");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      alert("Resume deleted successfully!");
    },
    onError: () => {
      alert("Failed to delete resume");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a PDF or Word document");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !title.trim()) {
      alert("Please select a file and enter a title");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title.trim());

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600">You need to be logged in to manage your resumes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-600">Manage your resume files for job applications</p>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Upload Resume
          </button>
        </div>

        {/* Resumes List */}
        {isLoading ? (
          <div className="text-center py-8">
            <FaSpinner className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
            <p className="mt-2 text-gray-600">Loading resumes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Failed to load resumes. Please try again.</p>
          </div>
        ) : resumes && resumes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDelete={() => handleDelete(resume.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No resumes yet</h3>
            <p className="mt-1 text-gray-600">Upload your first resume to get started with applications.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaUpload className="mr-2" />
              Upload Resume
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Resume</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Software Engineer Resume"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>

                {selectedFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending || !selectedFile || !title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
