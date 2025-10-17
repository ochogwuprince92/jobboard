from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import PasswordResetSerializer as BasePasswordResetSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer as BaseRegisterSerializer
from allauth.account import app_settings as allauth_settings

User = get_user_model()

# -----------------------------
# Custom Serializers for dj-rest-auth
# -----------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'is_verified', 'is_employer')
        read_only_fields = ('email', 'is_verified')

class CustomRegisterSerializer(BaseRegisterSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2')
        extra_kwargs = {
            'password1': {'write_only': True},
            'password2': {'write_only': True},
        }
    
    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'phone_number': self.validated_data.get('phone_number', ''),
            'password1': self.validated_data.get('password1', ''),
        }

class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})

    def _validate_email(self, email, password):
        user = None
        if email and password:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                return user
        return None

    def _validate_phone(self, phone_number, password):
        user = None
        if phone_number and password:
            user = User.objects.filter(phone_number=phone_number).first()
            if user and user.check_password(password):
                return user
        return None

    def validate(self, attrs):
        email = attrs.get('email')
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')

        user = None
        if email:
            user = self._validate_email(email, password)
        elif phone_number:
            user = self._validate_phone(phone_number, password)
        
        if not user:
            raise serializers.ValidationError('Unable to log in with provided credentials.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        attrs['user'] = user
        return attrs

class CustomPasswordResetSerializer(BasePasswordResetSerializer):
    def get_email_options(self):
        return {
            'email_template_name': 'account/email/password_reset_key_message.txt',
            'html_email_template_name': 'account/email/password_reset_key_message.html',
        }

# -----------------------------
# Existing Serializers for User Auth Flow
# -----------------------------

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

class VerifyOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    otp = serializers.CharField(max_length=6)
    purpose = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()

class ResetPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)
