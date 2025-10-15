
from celery import shared_task
from .services import NotificationService

@shared_task
def send_otp_task(to_email: str, otp: str):
    NotificationService.send_otp_email(to_email, otp)

@shared_task
def send_job_alert_task(to_email: str, job_title: str, company: str):
    NotificationService.send_job_alert_email(to_email, job_title, company)

@shared_task
def send_application_task(to_email: str, job_title: str, applicant_email: str):
    NotificationService.send_application_email(to_email, job_title, applicant_email)
