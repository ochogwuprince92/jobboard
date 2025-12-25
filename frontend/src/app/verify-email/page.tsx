'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/api/auth';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('No verification token provided in the URL.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } catch (err) {
        console.error('Email verification error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to verify email. The link may be invalid or expired.');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'verifying' && (
              <>
                <FaSpinner className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Verifying your email
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <FaCheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Email verified successfully!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Your email has been verified. You will be redirected to the login page shortly.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Login
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <FaTimesCircle className="mx-auto h-12 w-12 text-red-600" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Verification failed
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  {error}
                </p>
                <div className="mt-6 space-y-4">
                  <Link
                    href="/login"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Login
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
