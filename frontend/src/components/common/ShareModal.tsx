"use client";

import { useState } from "react";
import {
  FaShare,
  FaCopy,
  FaEnvelope,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaTimes,
  FaCheck
} from "react-icons/fa";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobCompany: string;
  jobUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  jobTitle,
  jobCompany,
  jobUrl
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Check out this job opportunity: ${jobTitle} at ${jobCompany}`;
  const encodedUrl = encodeURIComponent(jobUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareOptions = [
    {
      name: "Copy Link",
      icon: FaCopy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(jobUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      },
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700"
    },
    {
      name: "Email",
      icon: FaEnvelope,
      action: () => {
        const subject = encodeURIComponent(`Job Opportunity: ${jobTitle}`);
        const body = encodeURIComponent(`${shareText}\n\n${jobUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
      color: "bg-red-100 hover:bg-red-200 text-red-700"
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`);
      },
      color: "bg-blue-100 hover:bg-blue-200 text-blue-500"
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
      },
      color: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
      },
      color: "bg-blue-700 hover:bg-blue-800 text-white"
    }
  ];

  const handleNativeShare = () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title: jobTitle,
        text: shareText,
        url: jobUrl,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share this job</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-1">{jobTitle}</h4>
            <p className="text-sm text-gray-600">{jobCompany}</p>
          </div>

          {/* Native Share API button (if supported) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaShare className="mr-2" />
              Share via device
            </button>
          )}

          {/* Share options grid */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${option.color}`}
              >
                {option.name === "Copy Link" && copied ? (
                  <FaCheck className="w-6 h-6 mb-2 text-green-600" />
                ) : (
                  <option.icon className="w-6 h-6 mb-2" />
                )}
                <span className="text-sm font-medium">
                  {option.name === "Copy Link" && copied ? "Copied!" : option.name}
                </span>
              </button>
            ))}
          </div>

          {/* Direct link display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Direct link:</p>
            <p className="text-sm text-gray-900 break-all font-mono">{jobUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}