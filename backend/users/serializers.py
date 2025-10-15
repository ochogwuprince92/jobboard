from rest_framework import serializers

# -----------------------------
# Serializers for User Auth Flow
# -----------------------------

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # accepts email or phone
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
