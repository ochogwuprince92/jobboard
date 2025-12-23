'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { handleOAuthCallback } from '@/api/social';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const response = await handleOAuthCallback('google', searchParams);

        // Store tokens
        if (response.access && response.refresh) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);

          // Update auth context if needed
          if (response.user) {
            // Update user data in context
          }

          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          throw new Error('No tokens received from Google login');
        }
      } catch (error) {
        console.error('Google login failed:', error);
        router.push('/login?error=google_login_failed');
      }
    };

    // Only process if we have the authorization code
    if (searchParams.get('code')) {
      processAuth();
    } else if (searchParams.get('error')) {
      router.push('/login?error=oauth_error');
    }
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google login...</p>
      </div>
    </div>
  );
}