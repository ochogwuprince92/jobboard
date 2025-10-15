
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls', namespace='users')),
    path('api/', include('jobs.urls', namespace='jobs')),
    path('api/', include('employers.urls', namespace='employers')),
    path('api/', include('resumes.urls', namespace='resumes')),
    # path('api/ai/', include('ai.urls', namespace='ai')),
]
