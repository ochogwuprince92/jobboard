from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework_simplejwt.views import TokenRefreshView
# from dj_rest_auth.registration.views import SocialLoginView
# from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter, OAuth2LoginView, OAuth2CallbackView
# from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
# from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
# from allauth.socialaccount.providers.linkedin_oauth2.views import LinkedInOAuth2Adapter

# Social Auth Views
# class GithubLogin(SocialLoginView):
#     adapter_class = GitHubOAuth2Adapter
#     callback_url = 'http://localhost:3000/auth/github/callback'

# class FacebookLogin(SocialLoginView):
#     adapter_class = FacebookOAuth2Adapter
#     callback_url = 'http://localhost:3000/auth/facebook/callback'

# class LinkedInLogin(SocialLoginView):
#     adapter_class = LinkedInOAuth2Adapter
#     callback_url = 'http://localhost:3000/auth/linkedin/callback'

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Endpoints
    path('api/', include('users.urls', namespace='users')),
    path('api/', include('jobs.urls', namespace='jobs')),
    path('api/', include('employers.urls', namespace='employers')),
    path('api/', include('resumes.urls', namespace='resumes')),
    path('api/', include('scraper.urls', namespace='scraper')),
    path('api/', include('ai.urls', namespace='ai')),
    
    # # Auth URLs
    # path('api/auth/', include('dj_rest_auth.urls')),
    # path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Social Auth URLs
    # path('api/auth/github/', GithubLogin.as_view(), name='github_login'),
    # path('api/auth/facebook/', FacebookLogin.as_view(), name='facebook_login'),
    # path('api/auth/linkedin/', LinkedInLogin.as_view(), name='linkedin_login'),
    
    # # Token refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
