from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from users.models import User
from resumes.models import Resume
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile

class ResumeTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="applicant@example.com",
            password="pass123",
            first_name="Jane",
            last_name="Doe"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_upload_resume(self):
        url = reverse("resumes:resume-list")
        file = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
        response = self.client.post(url, {"file": file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resume.objects.count(), 1)
        self.assertEqual(Resume.objects.first().applicant, self.user)
