
from celery import shared_task

@shared_task
def send_application_email_task(to_email, subject, body):
    """
    Sends an email notification when a job application is created or updated.
    """
    # Replace with actual email sending logic
    print(f"Sending email to {to_email} | Subject: {subject}")
    print(f"Body:\n{body}")
    return True
