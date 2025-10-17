from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from .services import ResumeService

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]
    queryset = Resume.objects.none()  # Default queryset to prevent warning

    def get_queryset(self):
        # Only the authenticated user's resumes
        if not self.request.user.is_authenticated:
            return Resume.objects.none()
        return Resume.objects.filter(applicant=self.request.user)
    
    def perform_create(self, serializer):
        # Use request.user as the applicant 
        serializer.save(applicant=self.request.user)