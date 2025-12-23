# Social auth setup

This project supports social authentication via django-allauth + dj-rest-auth.

This file explains how to configure social providers and create SocialApp entries.

Environment variables

- SOCIAL_GOOGLE_CLIENT_ID
- SOCIAL_GOOGLE_SECRET
- SOCIAL_GITHUB_CLIENT_ID
- SOCIAL_GITHUB_SECRET
- SOCIAL_LINKEDIN_CLIENT_ID
- SOCIAL_LINKEDIN_SECRET
- SOCIAL_FACEBOOK_CLIENT_ID
- SOCIAL_FACEBOOK_SECRET

Usage

1. Ensure the environment variables above are set (for each provider you want to enable).
2. Run the management command to create/update SocialApp entries:

```bash
python manage.py create_social_apps
```

3. If your providers require redirect URLs, configure them in the provider console to point to:

- For redirect based flows: `https://<your-backend>/accounts/<provider>/login/callback/` or your frontend callback URL.

Notes

- The management command will add the SocialApp to the current `SITE_ID` (default 1).
- For client-side OAuth (recommended for SPAs), you can use provider SDKs (e.g., Google) to obtain an access token and POST it to the backend endpoint provided by `dj-rest-auth` (e.g., `/api/auth/google/`) with `access_token` to exchange for JWT tokens.
- See frontend README for example Google social login component.
