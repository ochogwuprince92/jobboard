import axios from 'axios';
import axiosClient from './axiosClient';

interface SocialResponse {
  access?: string;
  refresh?: string;
  user?: any;
  [key: string]: any;
}

/**
 * Exchange an OAuth authorization code with the backend to obtain JWT tokens.
 * This works with django-allauth social authentication.
 */
export async function socialLogin(provider: string, code: string, redirectUri?: string): Promise<SocialResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = `${base.replace(/\/$/, '')}/api/auth/${provider}/`;

  try {
    const response = await axios.post(url, {
      code,
      redirect_uri: redirectUri || `${window.location.origin}/auth/${provider}/callback`
    }, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      withCredentials: true,
    });

    if (response.status >= 400) {
      const msg = response.data?.detail || response.data?.error || response.data?.message || 'Social login failed';
      throw new Error(String(msg));
    }

    return response.data as SocialResponse;
  } catch (error: any) {
    if (error.response?.data) {
      const msg = error.response.data?.detail || error.response.data?.error || error.response.data?.message || 'Social login failed';
      throw new Error(String(msg));
    }
    throw error;
  }
}

/**
 * Generate OAuth authorization URL for a provider
 */
export function getOAuthUrl(provider: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base.replace(/\/$/, '')}/api/auth/${provider}/`;
}

/**
 * Handle OAuth callback by extracting code from URL and exchanging for tokens
 */
export async function handleOAuthCallback(provider: string, searchParams: URLSearchParams): Promise<SocialResponse> {
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    throw new Error(`OAuth error: ${error}`);
  }

  if (!code) {
    throw new Error('No authorization code received');
  }

  const redirectUri = `${window.location.origin}/auth/${provider}/callback`;
  return socialLogin(provider, code, redirectUri);
}
