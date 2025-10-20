from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .models import User, EmailOTP

class UserRepository:
    """
    Repository layer to handle all direct database operations.
    """
    @staticmethod
    def get_by_email_or_phone(identifier):
        """Fetch user by email or phone number."""
        if "@" in identifier:
            return User.objects.filter(email=identifier).first()
        return User.objects.filter(phone_number=identifier).first()

    @staticmethod
    def create_user(**kwargs):
        """Create and return a new user."""
        return User.objects.create_user(**kwargs)

    @staticmethod
    def create_otp(user, otp, purpose):
        """Save an OTP record for a given user and purpose."""
        hashed_otp = make_password(otp)
        expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRATION_MINUTES)
        return EmailOTP.objects.create(user=user, otp=hashed_otp, purpose=purpose, expires_at=expires_at)

    @staticmethod
    def verify_otp(user, otp, purpose):
        """
        Verify OTP: exists, not expired, not used, and matches hashed value.
        """
        otp_obj = EmailOTP.objects.filter(
            user=user,
            purpose=purpose,
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()
        if otp_obj and check_password(otp, otp_obj.otp):
            return otp_obj
        return None
