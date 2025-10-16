from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import timedelta
from .models import User, EmailOTP

# -----------------------------
# Repository Layer
# -----------------------------
# Handles all direct database operations
# to keep logic separate from services and views
# -----------------------------
class UserRepository:
    @staticmethod
    def get_by_email_or_phone(identifier):
        """
        Fetch a user using either email or phone number.
        """
        if "@" in identifier:
            return User.objects.filter(email=identifier).first()
        return User.objects.filter(phone_number=identifier).first()

    @staticmethod
    def create_user(**kwargs):
        """
        Create and return a new user.
        """
        return User.objects.create_user(**kwargs)

    @staticmethod
    def create_otp(user, otp, purpose):
        """
        Save an OTP record for a given purpose, hashing the OTP and setting an expiration time.
        """
        hashed_otp = make_password(otp)
        expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRATION_MINUTES)
        return EmailOTP.objects.create(user=user, otp=hashed_otp, purpose=purpose, expires_at=expires_at)
    
    @staticmethod
    def verify_otp(user, otp, purpose):
        """
        Find an OTP that matches, has not been used yet, and is not expired.
        """
        otp_obj = EmailOTP.objects.filter(
            user=user,
            purpose=purpose,
            is_used=False,
            expires_at__gt=timezone.now() # Check if OTP is not expired
        ).first()

        if otp_obj and check_password(otp, otp_obj.otp):
            return otp_obj
        return None
