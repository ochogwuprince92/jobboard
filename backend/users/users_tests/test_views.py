# apps/users/tests/test_views.py
from django.urls import reverse
from rest_framework.test import APITestCase
from users.models import User
from users.services import AuthService

class UserViewsTests(APITestCase):
    def setUp(self):
        self.email = "test@example.com"
        self.password = "Password123"
        self.user = AuthService.register(email=self.email, password=self.password, first_name="John", last_name="Doe")

    def test_register_view(self):
        url = reverse("users:register")  # Make sure to set your URLs namespace
        data = {
            "email": "newuser@example.com",
            "password": "Password123",
            "first_name": "Alice",
            "last_name": "Smith",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)
        self.assertIn("Verification sent", response.data["message"])

    def test_login_view(self):
        url = reverse("users:login")
        data = {"identifier": self.email, "password": self.password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)

    def test_verify_email_view(self):
        from users.services import AuthService
        token = AuthService.generate_verification_token(self.user)
        url = reverse("users:verify-email") + f"?token={token}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_verified)
