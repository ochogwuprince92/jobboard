# apps/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .services import AuthService, OTPService
from .repository import UserRepository
from .models import User

# -----------------------------
# User Registration
# -----------------------------
class RegisterView(APIView):
    def post(self, request):
        """
        Create a user with email or phone number and send OTP or verification token.
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        AuthService.register(**serializer.validated_data)
        return Response({"message": "Verification sent"}, status=status.HTTP_201_CREATED)


# -----------------------------
# Email Verification
# -----------------------------
class VerifyEmailView(APIView):
    def get(self, request):
        """
        Verify email using the token link sent during registration.
        """
        token = request.query_params.get("token")
        try:
            user_data = AuthService.decode_verification_token(token)
            user = User.objects.get(id=user_data["user_id"])
            user.is_verified = True
            user.is_active = True
            user.save()
            return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Login View
# -----------------------------
class LoginView(APIView):
    def post(self, request):
        """
        Login via email or phone number.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = AuthService.login(**serializer.validated_data)

        if token:
            return Response(token, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# -----------------------------
# Forgot Password
# -----------------------------
class ForgotPasswordView(APIView):
    def post(self, request):
        """
        Send OTP for password reset.
        """
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        AuthService.forgot_password(serializer.validated_data["identifier"])
        return Response({"message": "OTP sent for password reset"}, status=status.HTTP_200_OK)


# -----------------------------
# Reset Password
# -----------------------------
class ResetPasswordView(APIView):
    def post(self, request):
        """
        Reset password after verifying OTP.
        """
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserRepository.get_by_email_or_phone(serializer.validated_data["identifier"])

        if OTPService.verify_otp(user, serializer.validated_data["otp"], purpose="reset_password"):
            AuthService.reset_password(user, serializer.validated_data["new_password"])
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

        return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
