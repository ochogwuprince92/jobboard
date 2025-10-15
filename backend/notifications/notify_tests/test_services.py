# notifications/tests/test_services.py
from django.test import TestCase
from django.core import mail
from notifications.services import NotificationService

class NotificationServiceTests(TestCase):

    def test_send_otp_email(self):
        NotificationService.send_otp_email("user@example.com", otp="123456")

        # Check that one email was sent
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]

        self.assertIn("123456", email.body)
        self.assertEqual(email.subject, "Your Verification OTP")
        self.assertEqual(email.to, ["user@example.com"])

    def test_send_job_alert_email(self):
        NotificationService.send_job_alert_email("user@example.com", "Backend Dev", "TechCorp")

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]

        self.assertIn("Backend Dev", email.body)
        self.assertIn("TechCorp", email.body)
        self.assertIn("New Job Alert", email.subject)

    def test_send_application_email(self):
        NotificationService.send_application_email(
            "employer@example.com", "UI Designer", "applicant@example.com"
        )

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]

        self.assertIn("UI Designer", email.body)
        self.assertIn("applicant@example.com", email.body)
        self.assertIn("New Application for UI Designer", email.subject)
