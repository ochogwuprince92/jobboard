from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Endpoints
    path('api/', include('users.urls', namespace='users')),
    path('api/', include('jobs.urls', namespace='jobs')),
    path('api/', include('employers.urls', namespace='employers')),
    path('api/', include('resumes.urls', namespace='resumes')),
    path('api/', include('scraper.urls', namespace='scraper')),
    path('api/', include('ai.urls', namespace='ai')),
]
