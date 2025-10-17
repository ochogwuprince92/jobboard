from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()

class EmailOrPhoneModelBackend(ModelBackend):
    """
    Custom authentication backend that supports both email and phone number login.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None
            
        try:
            # Try to find user by email or phone number
            user = User.objects.get(
                Q(email__iexact=username) | 
                Q(phone_number=username)
            )
            
            # Verify the password
            if user.check_password(password):
                return user
                
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            # Run the default password hasher once to reduce the timing difference
            # between existing and non-existing users
            User().set_password(password)
            
        return None
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
