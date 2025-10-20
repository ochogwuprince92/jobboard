from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

# -----------------------------
# Custom User Manager
# -----------------------------
class UserManager(BaseUserManager):
    """
    Custom manager for User model to handle creation of users and superusers.
    Supports email or phone number for authentication.
    """
    def create_user(self, email=None, phone_number=None, password=None, **extra_fields):
        """
        Create a standard user.
        At least one of email or phone_number must be provided.
        Ensures no duplicates.
        """
        if not email and not phone_number:
            raise ValueError("User must have either email or phone number")

        if email:
            email = self.normalize_email(email)  # Normalize email

        # Check for existing user by email or phone
        existing_user = None
        if email:
            existing_user = self.model.objects.filter(email__iexact=email).first()
        if not existing_user and phone_number:
            existing_user = self.model.objects.filter(phone_number=phone_number).first()

        # Raise error if user exists
        if existing_user:
            if email and existing_user.email and existing_user.email.lower() == email.lower():
                raise ValueError("A user with this email already exists.")
            if phone_number and existing_user.phone_number == phone_number:
                raise ValueError("A user with this phone number already exists.")

        # Create and save user
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create a superuser with all permissions.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email=email, password=password, **extra_fields)


# -----------------------------
# Custom User Model
# -----------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that supports email or phone authentication.
    """
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    # User status fields
    is_employer = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)  # Email/phone verification
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # Link custom manager
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def get_username(self):
        """Return the primary username (email or phone)."""
        return self.email or self.phone_number

    def __str__(self):
        """String representation of user."""
        return self.email if self.email else f"User {self.phone_number}"


# -----------------------------
# OTP Model
# -----------------------------
def get_default_expiry():
    """Calculate default OTP expiration based on settings."""
    return timezone.now() + timedelta(minutes=settings.OTP_EXPIRATION_MINUTES)

class EmailOTP(models.Model):
    """
    Stores one-time passwords (OTP) for email/phone verification and password reset.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=128)  # Hashed OTP
    purpose = models.CharField(max_length=50)  # Example: register, reset_password
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_default_expiry)
    is_used = models.BooleanField(default=False)  # Track if OTP has been used

    def __str__(self):
        return f"{self.user} - {self.purpose}"
