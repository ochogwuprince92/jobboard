'use client';

import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SocialLoginButtons() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    github: false,
    linkedin: false,
    facebook: false
  });

  const handleSocialLogin = async (provider: 'github' | 'linkedin' | 'facebook') => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));
      
      // Open a popup window for OAuth
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `${API_URL}/api/auth/${provider}/`,
        `${provider}OAuthPopup`,
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
      );

      // Check if popup was blocked
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup was blocked. Please allow popups for this site.');
      }

      // Poll to check if popup is closed
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // Redirect to dashboard after successful login
          // The actual redirect will be handled by the auth callback
          router.refresh(); // Refresh to update auth state
        }
      }, 1000);
    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      // Show error to user (you can implement a toast or alert here)
      alert(`Failed to start ${provider} login. Please try again.`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading.github}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading.github 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isLoading.github ? (
            <div className="h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <FaGithub className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('linkedin')}
          disabled={isLoading.linkedin}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading.linkedin 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isLoading.linkedin ? (
            <div className="h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <FaLinkedin className="h-5 w-5 text-[#0077B5]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading.facebook}
          className={`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading.facebook 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isLoading.facebook ? (
            <div className="h-5 w-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <FaFacebook className="h-5 w-5 text-[#1877F2]" />
          )}
        </button>
      </div>
    </div>
  );
}
