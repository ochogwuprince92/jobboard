from .repository import UserRepository
from core.utils.email_otp import send_otp_email, send_verification_email
from django.conf import settings
import random
import jwt
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import RefreshToken


# -----------------------------
# OTP Service
# -----------------------------
class OTPService:
    @staticmethod
    def generate_otp():
        """Generate a 6-digit random OTP."""
        return str(random.randint(100000, 999999))

    @classmethod
    def send_otp(cls, user, purpose):
        """Create and send OTP for the given user and purpose."""
        otp = cls.generate_otp() # Generate plain text OTP for sending
        UserRepository.create_otp(user, otp, purpose) # Repository handles hashing and expiration

        if user.email:
            send_otp_email(user.email, otp)
        # TODO: Add logic to send OTP via SMS if phone_number is available

        return otp

    @staticmethod
    def verify_otp(user, otp, purpose):
        """Verify if an OTP is valid for the user and purpose."""
        otp_obj = UserRepository.verify_otp(user, otp, purpose)
        if otp_obj:
            otp_obj.is_used = True
            otp_obj.save()
            return True
        return False


# -----------------------------
# Auth Service
# -----------------------------
class AuthService:
    @staticmethod
    def generate_verification_token(user):
        """Create a short-lived JWT for email verification."""
        payload = {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(minutes=15) # Token valid for 15 minutes
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    @staticmethod
    def decode_verification_token(token):
        """Decode and validate a verification token."""
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

    @staticmethod
    def register(email=None, phone_number=None, password=None,
                 first_name=None, last_name=None, address=None):
        """
        Register a new user via email or phone.
        - Email gets verification token.
        - Phone gets OTP.
        - first_name and last_name are required.
        """

        # --- Validation ---
        if not first_name or not last_name:
            raise ValueError("First name and last name are required.")

        if not password:
            raise ValueError("Password is required.")

        if not email and not phone_number:
            raise ValueError("Either email or phone number is required.")

        # --- Prevent duplicates ---
        if email and UserRepository.get_by_email_or_phone(email):
            raise ValueError("Email already registered.")
        if phone_number and UserRepository.get_by_email_or_phone(phone_number):
            raise ValueError("Phone number already registered.")

        # --- Create the user ---
        user = UserRepository.create_user(
            email=email,
            phone_number=phone_number,
            password=password,
            first_name=first_name,
            last_name=last_name,
            address=address or "",
        )

        # --- Trigger verification ---
        if email:
            token = AuthService.generate_verification_token(user)
            send_verification_email(user.email, token)
        elif phone_number:
            OTPService.send_otp(user, purpose="register")

        return user

    @staticmethod
    def login(identifier, password):
        """Authenticate a user by email or phone and return JWT tokens."""
        user = UserRepository.get_by_email_or_phone(identifier)
        
        if not user:
            raise ValueError("User not found.")
            
        if not user.check_password(password):
            raise ValueError("Incorrect password.")
            
        if not user.is_verified:
            raise ValueError("Please verify your email before logging in. Check your email for the verification link.")
            
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    @staticmethod
    def reset_password(user, new_password):
        """Change a user's password."""
        user.set_password(new_password)
        user.save()
        return True

    @staticmethod
    def forgot_password(identifier):
        """Send OTP for password reset."""
        user = UserRepository.get_by_email_or_phone(identifier)
        if not user:
            raise ValueError("User not found.")
        OTPService.send_otp(user, purpose="reset_password")
        return True
