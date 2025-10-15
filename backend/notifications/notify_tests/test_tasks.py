# notifications/tests/test_tasks.py
from django.test import TestCase
from unittest.mock import patch
from notifications.tasks import send_otp_task, send_job_alert_task, send_application_task
from notifications.services import NotificationService

class NotificationTasksTests(TestCase):

    @patch.object(NotificationService, 'send_otp_email')
    def test_send_otp_task(self, mock_send):
        send_otp_task("user@example.com", "654321")
        mock_send.assert_called_once_with("user@example.com", "654321")

    @patch.object(NotificationService, 'send_job_alert_email')
    def test_send_job_alert_task(self, mock_send):
        send_job_alert_task("user@example.com", "Backend Dev", "TechCorp")
        mock_send.assert_called_once_with("user@example.com", "Backend Dev", "TechCorp")

    @patch.object(NotificationService, 'send_application_email')
    def test_send_application_task(self, mock_send):
        send_application_task("employer@example.com", "UI Designer", "applicant@example.com")
        mock_send.assert_called_once_with("employer@example.com", "UI Designer", "applicant@example.com")
