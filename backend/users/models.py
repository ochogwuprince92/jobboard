from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

# -----------------------------
# Custom User Manager
# -----------------------------
class UserManager(BaseUserManager):
    def create_user(self, email=None, phone_number=None, password=None, **extra_fields):
        """
        Create and return a regular user.
        At least one of email or phone_number must be provided.
        """
        if not email and not phone_number:
            raise ValueError("User must have either email or phone number")

        if email:
            email = self.normalize_email(email)
            
        # Ensure at least one of email or phone is set
        if not email and not phone_number:
            raise ValueError("Either email or phone number must be provided")
            
        # Check for existing users with the same email or phone
        existing_user = None
        if email:
            existing_user = self.model.objects.filter(email__iexact=email).first()
        if not existing_user and phone_number:
            existing_user = self.model.objects.filter(phone_number=phone_number).first()
            
        if existing_user:
            if email and existing_user.email and existing_user.email.lower() == email.lower():
                raise ValueError("A user with this email already exists.")
            if phone_number and existing_user.phone_number == phone_number:
                raise ValueError("A user with this phone number already exists.")

        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with all permissions.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email=email, password=password, **extra_fields)


# -----------------------------
# Custom User Model
# -----------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that supports authentication via email or phone number.
    """
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    # Default fields
    is_employer = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    # Connect the custom manager
    objects = UserManager()

    # Use email as the default username field for admin
    USERNAME_FIELD = "email"
    # Make phone_number required only if email is not provided
    REQUIRED_FIELDS = ["first_name", "last_name"]
    
    def get_username(self):
        """Return the username for this User (email or phone number)."""
        return self.email or self.phone_number

    def __str__(self):
        """String representation of the user (email if available, otherwise phone number)."""
        if self.email:
            return self.email
        return f"User {self.phone_number}" if self.phone_number else "Anonymous User"


# -----------------------------
# OTP Model for Email/Phone Verification
# -----------------------------
def get_default_expiry():
    """Helper function to calculate default OTP expiry time"""
    return timezone.now() + timedelta(minutes=settings.OTP_EXPIRATION_MINUTES)

class EmailOTP(models.Model):
    """
    Stores one-time passwords for email/phone verification and password reset.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=128) # Store hashed OTP
    purpose = models.CharField(max_length=50)  # register, reset_password, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_default_expiry) # OTP expiration time
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.purpose}"
