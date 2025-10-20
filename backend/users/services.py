from datetime import datetime, timedelta
import random
import jwt
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .repository import UserRepository
from core.utils.email_otp import send_otp_email, send_verification_email
from rest_framework.exceptions import ValidationError
from users.models import User

# -----------------------------
# OTP Service
# -----------------------------
class OTPService:
    """Handles OTP generation, sending, and verification."""
    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP."""
        return str(random.randint(100000, 999999))

    @classmethod
    def send_otp(cls, user, purpose):
        """Send OTP via email or phone."""
        otp = cls.generate_otp()
        UserRepository.create_otp(user, otp, purpose)
        if user.email:
            send_otp_email(user.email, otp)
        # TODO: send SMS if phone_number exists
        return otp

    @staticmethod
    def verify_otp(user, otp, purpose):
        """Check if OTP is valid, mark it as used if so."""
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
    """Handles user registration, login, verification, and password management."""
    @staticmethod
    def generate_verification_token(user):
        """Create a short-lived JWT for email verification."""
        payload = {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(minutes=15)
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    
class AuthService:
    # ... your existing AuthService methods

    @staticmethod
    def verify_email(token: str):
        """
        Decodes the verification token, fetches the user, and confirms their email.
        """
        try:
            # Decode JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get("user_id")

            if not user_id:
                raise ValidationError("Invalid token payload.")

            user = User.objects.filter(id=user_id).first()
            if not user:
                raise ValidationError("User not found.")

            if user.is_verified:
                return user  # Already verified

            user.is_verified = True
            user.save()
            return user

        except jwt.ExpiredSignatureError:
            raise ValidationError("Token has expired.")
        except jwt.InvalidTokenError:
            raise ValidationError("Invalid token.")
        except Exception as e:
            raise ValidationError(str(e))
        
    @staticmethod
    def decode_verification_token(token):
        """Decode and validate verification token."""
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

    @staticmethod
    def register(email=None, phone_number=None, password=None, first_name=None, last_name=None, address=None):
        """Register a new user and send verification (email) or OTP (phone)."""
        if not first_name or not last_name:
            raise ValueError("First name and last name are required.")
        if not password:
            raise ValueError("Password is required.")
        if not email and not phone_number:
            raise ValueError("Either email or phone number is required.")
        if email and UserRepository.get_by_email_or_phone(email):
            raise ValueError("Email already registered.")
        if phone_number and UserRepository.get_by_email_or_phone(phone_number):
            raise ValueError("Phone number already registered.")

        user = UserRepository.create_user(
            email=email,
            phone_number=phone_number,
            password=password,
            first_name=first_name,
            last_name=last_name,
            address=address or "",
        )

        if email:
            token = AuthService.generate_verification_token(user)
            send_verification_email(user.email, token)
        elif phone_number:
            OTPService.send_otp(user, "register")

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
            raise ValueError("Please verify your email first.")
        refresh = RefreshToken.for_user(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}

    @staticmethod
    def reset_password(user, new_password):
        """Change user's password."""
        user.set_password(new_password)
        user.save()
        return True

    @staticmethod
    def forgot_password(identifier):
        """Send OTP for password reset."""
        user = UserRepository.get_by_email_or_phone(identifier)
        if not user:
            raise ValueError("User not found.")
        OTPService.send_otp(user, "reset_password")
        return True
