from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp):
    """
    Sends a one-time password (OTP) to the user's email.
    Used for 2FA or password reset verification.
    """
    subject = "Your OTP Code"
    message = f"Your one-time password is: {otp}"
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


def send_verification_email(email, token):
    """
    Sends a verification email with a link to activate the user's account.
    """
    subject = "Verify Your Email"
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    message = f"Click the link below to verify your email:\n\n{verification_link}"
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
