# jobs/tasks.py

from celery import shared_task
from django.core.mail import send_mail

@shared_task
def notify_employer_new_application(job_title, employer_email, applicant_name):
    """
    Notify employer via email that a new applicant has applied to their job.
    """
    subject = f"New Application for {job_title}"
    body = f"{applicant_name} has applied for your job: {job_title}."
    send_mail(subject, body, "no-reply@jobboard.com", [employer_email])
    return True
