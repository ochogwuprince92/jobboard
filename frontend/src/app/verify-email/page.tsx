'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Token from URL:', token);
    setDebugInfo(prev => prev + '\nToken from URL: ' + token);

    if (!token) {
      const errorMsg = 'No verification token provided';
      console.error(errorMsg);
      setStatus('error');
      setError(errorMsg);
      setDebugInfo(prev => prev + '\n' + errorMsg);
      return;
    }

    const verify = async () => {
      try {
        const apiUrl = `/api/verify-email?token=${encodeURIComponent(token)}`;
        console.log('Making request to:', apiUrl);
        setDebugInfo(prev => prev + '\nMaking request to: ' + apiUrl);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        setDebugInfo(prev => prev + '\nResponse status: ' + response.status);
        
        let data;
        try {
          data = await response.json();
          console.log('Response data:', data);
          setDebugInfo(prev => prev + '\nResponse data: ' + JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          setDebugInfo(prev => prev + '\nFailed to parse JSON: ' + jsonError);
          throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
          throw new Error(data.message || `Verification failed with status ${response.status}`);
        }
        
        console.log('Verification successful');
        setStatus('success');
        setDebugInfo(prev => prev + '\nVerification successful');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (err: any) {
        console.error('Verification error:', err);
        const errorMsg = err.name === 'AbortError' 
          ? 'Request timed out. Please check your connection and try again.'
          : err.message || 'Verification failed. Please try again.';
        
        setStatus('error');
        setError(errorMsg);
        setDebugInfo(prev => prev + '\nError: ' + errorMsg);
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Error'}
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-gray-600">Your email has been successfully verified! Redirecting to login...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-red-600">{error}</p>
              <div className="mt-4">
                <button
                  onClick={() => window.location.href = '/register'}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Back to registration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
