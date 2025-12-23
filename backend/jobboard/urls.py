from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path as django_path

# Social Auth Views
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter


# Social Auth Views
class GithubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://localhost:3000/auth/github/callback"


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback"


class LinkedInLogin(SocialLoginView):
    adapter_class = LinkedInOAuth2Adapter
    callback_url = "http://localhost:3000/auth/linkedin/callback"


urlpatterns = [
    path("admin/", admin.site.urls),
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # API Endpoints
    path(
        "api/",
        include(
            [
                # Auth URLs - include auth patterns from users app
                path("auth/", include("users.urls", namespace="auth")),
                # Other app URLs
                path("", include("jobs.urls", namespace="jobs")),
                path("", include("employers.urls", namespace="employers")),
                path("", include("resumes.urls", namespace="resumes")),
                path("", include("scraper.urls", namespace="scraper")),
                path("", include("ai.urls", namespace="ai")),
            ]
        ),
    ),
    # # Auth URLs
    # dj-rest-auth endpoints (login, logout, password reset, token endpoints)
    # path("api/auth/", include("dj_rest_auth.urls")),
    # registration endpoints (optional, includes social token endpoints when allauth is configured)
    # path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    # Allauth (useful for provider redirect flows / admin integration)
    # path("accounts/", include("allauth.urls")),
    # Social Auth URLs
    path("api/auth/github/", GithubLogin.as_view(), name="github_login"),
    path("api/auth/google/", GoogleLogin.as_view(), name="google_login"),
    path("api/auth/linkedin/", LinkedInLogin.as_view(), name="linkedin_login"),
    # # Token refresh
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Compatibility path for frontend expecting /api/auth/token/refresh/
    django_path(
        "api/auth/token/refresh/", TokenRefreshView.as_view(), name="auth_token_refresh"
    ),
]
