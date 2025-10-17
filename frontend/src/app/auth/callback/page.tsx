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
          // First get user data using the access token
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${access}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          
          const userData = await response.json();
          
          // Store tokens and update auth state with user data
          await login(access, refresh, userData);
          
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
