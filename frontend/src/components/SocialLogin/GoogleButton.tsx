import React from 'react';

type Props = {
  /**
   * Called when an access token from the provider is available. The parent
   * component should call `socialLogin('google', token)` to exchange it.
   */
  onToken?: (token: string) => void;
  /** Optional label for the button */
  label?: string;
};

/**
 * Minimal Google social-login button.
 *
 * NOTE: This component is intentionally lightweight — it does not ship the
 * Google SDK. Instead it opens the provider auth URL (redirect flow). For
 * SPA client-side integration, replace this with an implementation that
 * uses the Google Identity Services SDK and calls `onToken` with the
 * provider access token.
 */
const GoogleButton: React.FC<Props> = ({ onToken, label }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT || `${window.location.origin}/auth/google/callback`;

  const handleClick = () => {
    if (!clientId) {
      // Fallback: open the backend-provided allauth URL so admins can use redirect flow
      const authUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/accounts/google/login/`;
      window.open(authUrl, '_blank', 'noopener');
      return;
    }

    // Construct an OAuth2 implicit/response_type=token URL (simple fallback).
    // Note: Implicit flow is not recommended; for production prefer PKCE or
    // server-side exchange. This provides a starting point developers can
    // adapt to their chosen flow.
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'token');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('include_granted_scopes', 'true');

    // Open popup so the app can handle the redirect (parent must implement callback)
    window.open(url.toString(), '_blank', 'noopener');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-white text-gray-700 hover:shadow"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.5 1.2 8.9 3.5l6.6-6.6C34.9 2.2 29.8 0 24 0 14.7 0 6.9 5.6 3 13.7l7.9 6.1C12.6 14 17.7 9.5 24 9.5z"/>
      </svg>
      {label || 'Continue with Google'}
    </button>
  );
};

export default GoogleButton;
