'use client';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getOAuthUrl } from '@/api/social';

export default function SocialLoginButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    github: false,
    google: false,
    linkedin: false
  });

  const handleSocialLogin = async (provider: 'github' | 'google' | 'linkedin') => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }));

      // Generate OAuth URL and redirect
      const authUrl = getOAuthUrl(provider);

      // Redirect to OAuth provider
      window.location.href = authUrl;

    } catch (error) {
      console.error(`Error during ${provider} login:`, error);
      alert(`Failed to start ${provider} login. Please try again.`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading.google}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold text-base transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 ${
            isLoading.google
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isLoading.google ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-3"></div>
              <span className="text-gray-500">Connecting...</span>
            </div>
          ) : (
            <>
              <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading.github}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold text-base transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-300 ${
            isLoading.github
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading.github ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
              <span className="text-gray-500">Connecting...</span>
            </div>
          ) : (
            <>
              <FaGithub className="h-6 w-6 mr-3 text-gray-900" />
              Continue with GitHub
            </>
          )}
        </button>

        {/* LinkedIn Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin('linkedin')}
          disabled={isLoading.linkedin}
          className={`group relative w-full flex items-center justify-center px-6 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold text-base transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 ${
            isLoading.linkedin
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading.linkedin ? (
            <div className="flex items-center">
              <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-3"></div>
              <span className="text-gray-500">Connecting...</span>
            </div>
          ) : (
            <>
              <FaLinkedin className="h-6 w-6 mr-3 text-[#0077B5]" />
              Continue with LinkedIn
            </>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
