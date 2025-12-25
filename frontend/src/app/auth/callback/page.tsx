'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the token from the URL
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');

        if (access && refresh) {
          // Store tokens
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          // Get user data
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/user/`, {
              headers: {
                'Authorization': `Bearer ${access}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              await response.json();
              // Update auth context with user data if needed
            }
          } catch (error) {
            console.warn('Could not fetch user data:', error);
          }

          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          // Handle error - no tokens in URL
          console.error('No authentication tokens found in URL');
          router.push('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Error processing authentication:', error);
        router.push('/login?error=auth_error');
      }
    };

    processAuth();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}
