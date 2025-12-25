from django.db import models
from django.conf import settings


class Resume(models.Model):
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes"
    )

    title = models.CharField(max_length=200, default="Untitled Resume")
    file = models.FileField(upload_to="resumes/")  # PDFs or DOCX
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_data = models.JSONField(null=True, blank=True)  # stub for future AI parsing
