from rest_framework import serializers
from .models import User, EmailOTP
from .repository import UserRepository


# -----------------------------
# User Serializer
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "is_verified",
            "is_employer",
        )
        read_only_fields = ("id", "is_verified", "is_employer")


# -----------------------------
# Registration Serializer
# -----------------------------
class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    # Standardize to `password` + `confirm_password` (confirm_password is the
    # 'confirm password' field). This is clearer than password1/password2 and
    # avoids confusion.
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        # Validate email/phone
        if not attrs.get("email") and not attrs.get("phone_number"):
            raise serializers.ValidationError(
                "Either email or phone number is required."
            )

        # Ensure passwords match
        password = attrs.get("password")
        confirm = attrs.get("confirm_password")

        if not password or not confirm:
            raise serializers.ValidationError(
                "Both password and confirm_password are required."
            )

        if password != confirm:
            raise serializers.ValidationError("Passwords do not match")

        return attrs


# -----------------------------
# Login Serializer
# -----------------------------
class LoginSerializer(serializers.Serializer):
    # Frontend may send `email` or `phone_number`, older API used `identifier`.
    identifier = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        if not (
            attrs.get("identifier") or attrs.get("email") or attrs.get("phone_number")
        ):
            raise serializers.ValidationError(
                "An email or phone number (or identifier) is required to login."
            )
        return attrs


# -----------------------------
# Verify Email / OTP Serializer
# -----------------------------
class VerifyEmailSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # email or phone
    key = serializers.CharField()


# -----------------------------
# Forgot/Reset Password Serializers
# -----------------------------
class ForgotPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()


class ResetPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    otp = serializers.CharField()
    new_password = serializers.CharField(write_only=True)


# -----------------------------
# Resend Verification Serializer
# -----------------------------
class ResendVerificationSerializer(serializers.Serializer):
    identifier = serializers.CharField()


# -----------------------------
# Logout Serializer
# -----------------------------
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs.get("refresh")
        return attrs
