from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from users.models import User
from employers.models import Employer
from jobs.models import Job

class JobTests(APITestCase):
    def setUp(self):
        # -----------------------------
        # Users
        # -----------------------------
        self.employer_user = User.objects.create_user(
            email="boss@example.com",
            password="securepass123",
            first_name="Boss",
            last_name="Man",
            is_employer=True
        )
        self.employer = Employer.objects.create(
            user=self.employer_user,
            company_name="NextGen Tech",
            location="Lagos"
        )

        self.regular_user = User.objects.create_user(
            email="user@example.com",
            password="userpass123",
            first_name="Regular",
            last_name="User"
        )

        # -----------------------------
        # Jobs
        # -----------------------------
        self.job1 = Job.objects.create(
            title="Backend Developer",
            company="NextGen Tech",
            location="Remote",
            description="Work with Django and FastAPI",
            requirements="3+ years experience with Python",
            salary=500000,
            employment_type="Full-time",
            posted_by=self.employer_user
        )

        self.job2 = Job.objects.create(
            title="Frontend Developer",
            company="NextGen Tech",
            location="Lagos",
            description="React + Next.js",
            requirements="2+ years experience",
            salary=400000,
            employment_type="Full-time",
            posted_by=self.employer_user
        )

        # -----------------------------
        # API Clients
        # -----------------------------
        self.employer_client = APIClient()
        self.employer_client.force_authenticate(user=self.employer_user)

        self.user_client = APIClient()
        self.user_client.force_authenticate(user=self.regular_user)

    # -----------------------------
    # LIST
    # -----------------------------
    def test_list_jobs(self):
        url = reverse("jobs:job-list")
        response = self.user_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    # -----------------------------
    # FILTER
    # -----------------------------
    def test_filter_by_title_partial(self):
        url = reverse("jobs:job-list") + "?title=Back"
        response = self.user_client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Backend Developer")

    def test_filter_by_location_partial(self):
        url = reverse("jobs:job-list") + "?location=Lagos"
        response = self.user_client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["location"], "Lagos")

    # -----------------------------
    # SEARCH
    # -----------------------------
    def test_search_jobs_by_keyword(self):
        url = reverse("jobs:job-list") + "?search=React"
        response = self.user_client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Frontend Developer")

    # -----------------------------
    # SORT
    # -----------------------------
    def test_sort_jobs_by_salary_desc(self):
        url = reverse("jobs:job-list") + "?ordering=-salary"
        response = self.user_client.get(url)
        self.assertEqual(response.data[0]["title"], "Backend Developer")
        self.assertEqual(response.data[1]["title"], "Frontend Developer")

    # -----------------------------
    # CREATE (Employer only)
    # -----------------------------
    def test_employer_can_create_job(self):
        url = reverse("jobs:job-list")
        data = {
            "title": "DevOps Engineer",
            "company": "NextGen Tech",
            "location": "Abuja",
            "description": "CI/CD, Docker, Kubernetes",
            "requirements": "2+ years experience",
            "salary": 450000,
            "employment_type": "Full-time"
        }
        response = self.employer_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 3)

    def test_non_employer_cannot_create_job(self):
        url = reverse("jobs:job-list")
        data = {
            "title": "DevOps Engineer",
            "company": "NextGen Tech",
            "location": "Abuja",
            "description": "CI/CD, Docker, Kubernetes",
            "requirements": "2+ years experience",
            "salary": 450000,
            "employment_type": "Full-time"
        }
        response = self.user_client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        print(response.data)  # <-- will show which field is invalid
       
    # -----------------------------
    # DETAIL, UPDATE, DELETE
    # -----------------------------
    def test_employer_can_update_job(self):
        url = reverse("jobs:job-detail", args=[self.job1.id])
        data = {"title": "Backend Engineer"}
        response = self.employer_client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job1.refresh_from_db()
        self.assertEqual(self.job1.title, "Backend Engineer")

    def test_employer_can_delete_job(self):
        url = reverse("jobs:job-detail", args=[self.job1.id])
        response = self.employer_client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Job.objects.count(), 1)

