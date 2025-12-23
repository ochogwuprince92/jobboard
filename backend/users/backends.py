from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrPhoneModelBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in
    with either their email or phone number.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        try:
            # Try email first
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            # Try phone number if not found by email
            try:
                user = User.objects.get(phone_number=username)
            except User.DoesNotExist:
                return None

        if user and user.check_password(password):
            return user
        return None
