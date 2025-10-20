from rest_framework import serializers
from .models import User, EmailOTP
from .repository import UserRepository

# -----------------------------
# User Serializer
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name',
                  'phone_number', 'is_verified', 'is_employer')
        read_only_fields = ('id', 'is_verified', 'is_employer')


# -----------------------------
# Registration Serializer
# -----------------------------
class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if not attrs.get('email') and not attrs.get('phone_number'):
            raise serializers.ValidationError("Either email or phone number is required.")
        return attrs


# -----------------------------
# Login Serializer
# -----------------------------
class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


# -----------------------------
# Verify Email / OTP Serializer
# -----------------------------
class VerifyEmailSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # email or phone
    token = serializers.CharField()
    purpose = serializers.CharField()  # 'register' or 'reset_password'


# -----------------------------
# Forgot Password Serializer
# -----------------------------
class ForgotPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()


# -----------------------------
# Reset Password Serializer
# -----------------------------
class ResetPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)


# -----------------------------
# Resend Verification Serializer
# -----------------------------
class ResendVerificationSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)

    def validate_identifier(self, value):
        user = UserRepository.get_by_email_or_phone(value)
        if not user:
            raise serializers.ValidationError("No user found with this email or phone number.")
        if user.is_verified:
            raise serializers.ValidationError("User is already verified.")
        return value


# -----------------------------
# Logout Serializer
# -----------------------------
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs
