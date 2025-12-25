"use client";

import { FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";
import type { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
  onDelete: () => void;
}

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf' ? '📄' : extension?.includes('doc') ? '📝' : '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-2xl">
            {getFileIcon(resume.file)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {resume.title || 'Untitled Resume'}
            </h3>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</p>
              <p>File: {resume.file.split('/').pop()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <a
            href={resume.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Download resume"
          >
            <FaDownload className="h-4 w-4" />
          </a>

          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
            title="Delete resume"
          >
            <FaTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
