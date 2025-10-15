from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User
from employers.models import Employer


class EmployerTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="employer@example.com",
            password="pass1234",
            first_name="John",
            last_name="Doe",
            is_employer=True
        )
        self.client.force_authenticate(user=self.user)


    def test_create_employer_profile(self):
        """Employer should be able to create their profile."""
        data = {
            "company_name": "Techify",
            "website": "https://techify.io",
            "description": "We build smart tools for modern businesses.",
            "location": "Lagos, Nigeria",
        }
        url = reverse("employers:employer-list")  # From EmployerViewSet basename
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employer.objects.count(), 1)
        self.assertEqual(Employer.objects.first().company_name, "Techify")

    def test_employer_list_view(self):
        """Anyone should be able to view the list of employers."""
        Employer.objects.create(
            user=self.user,
            company_name="Softworks",
            website="https://softworks.ai",
            location="Abuja"
        )

        url = reverse("employers:employer-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_employer_detail_view(self):
        """Anyone can view employer detail by ID."""
        employer = Employer.objects.create(
            user=self.user,
            company_name="CodeSpark",
            location="Port Harcourt"
        )

        url = reverse("employers:employer-detail", args=[employer.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["company_name"], "CodeSpark")
