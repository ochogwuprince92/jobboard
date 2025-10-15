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
        Save an OTP record for a given purpose.
        """
        return EmailOTP.objects.create(user=user, otp=otp, purpose=purpose)
    
    @staticmethod
    def verify_otp(user, otp, purpose):
        """
        Find an OTP that matches and has not been used yet.
        """
        return EmailOTP.objects.filter(user=user, otp=otp, purpose=purpose, is_used=False).first()
