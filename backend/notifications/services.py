
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

class NotificationService:
    """Centralized service for sending notifications."""

    @staticmethod
    def send_email(to_email: str, subject: str, template_name: str, context: dict):
        """
        Sends an email using Django templates.
        :param to_email: recipient email
        :param subject: email subject
        :param template_name: path to template
        :param context: dict with template variables
        """
        message = render_to_string(template_name, context)
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )

    @staticmethod
    def send_otp_email(to_email: str, otp: str):
        NotificationService.send_email(
            to_email=to_email,
            subject="Your Verification OTP",
            template_name="notifications/otp_email.txt",
            context={"otp": otp}
        )

    @staticmethod
    def send_job_alert_email(to_email: str, job_title: str, company: str):
        NotificationService.send_email(
            to_email=to_email,
            subject=f"New Job Alert: {job_title}",
            template_name="notifications/job_alert.txt",
            context={"job_title": job_title, "company": company}
        )

    @staticmethod
    def send_application_email(to_email: str, job_title: str, applicant_email: str):
        NotificationService.send_email(
            to_email=to_email,
            subject=f"New Application for {job_title}",
            template_name="notifications/application_email.txt",
            context={"job_title": job_title, "applicant_email": applicant_email}
        )
