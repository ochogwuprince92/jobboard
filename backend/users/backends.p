from django.contrib.auth.backends import ModelBackend
from .models import User

class EmailOrPhoneModelBackend(ModelBackend):
    """
    Custom authentication backend to allow login with email or phone number.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        if username:
            if "@" in username:
                user = User.objects.filter(email=username).first()
            else:
                user = User.objects.filter(phone_number=username).first()

        # Check password and active status
        if user and user.check_password(password) and user.is_active:
            return user
        return None
