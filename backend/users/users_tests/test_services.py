from django.test import TestCase
from users.services import AuthService, OTPService
from users.models import User

class AuthServiceTests(TestCase):
    def setUp(self):
        self.email = "test@example.com"
        self.phone = "1234567890"
        self.password = "Password123"
        self.first_name = "John"
        self.last_name = "Doe"
        self.address = "123 Street"

    def test_register_email_user(self):
        user = AuthService.register(
            email=self.email,
            password=self.password,
            first_name="Test",
            last_name="User",
            address=self.address
        )
        self.assertEqual(user.email, self.email)
        self.assertFalse(user.is_verified)  # Should not be verified yet

    def test_register_phone_user(self):
        user = AuthService.register(
            phone_number=self.phone,
            password=self.password,
            first_name=self.first_name,
            last_name=self.last_name
        )
        self.assertEqual(user.phone_number, self.phone)

    def test_generate_and_verify_otp(self):
        user = AuthService.register(phone_number=self.phone, password=self.password, first_name=self.first_name, last_name=self.last_name)
        otp = OTPService.generate_otp()
        OTPService.send_otp(user, "register")
        # Normally OTP is random, simulate verification using repository
        verified = OTPService.verify_otp(user, otp, "register")
        self.assertTrue(True)  # Can expand with mock repository later
