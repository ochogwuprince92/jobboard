# apps/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from core.throttling import UserLoginRateThrottle # Import custom throttle
from .serializers import *
from .services import AuthService, OTPService
from .repository import UserRepository
from .models import User
import jwt
from django.core.exceptions import ObjectDoesNotExist

# -----------------------------
# User Registration
# -----------------------------
class RegisterView(APIView):
    throttle_classes = [AnonRateThrottle] # Apply throttle for anonymous users
    def post(self, request):
        """
        Create a user with email or phone number and send OTP or verification token.
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            AuthService.register(**serializer.validated_data)
            return Response({"message": "Verification sent"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
        except jwt.ExpiredSignatureError:
            return Response({"message": "Verification token has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({"message": "Invalid verification token."}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------
# Login View
# -----------------------------
class LoginView(APIView):
    throttle_classes = [UserLoginRateThrottle] # Apply custom throttle for login attempts
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
    throttle_classes = [AnonRateThrottle] # Apply throttle for anonymous users
    def post(self, request):
        """
        Send OTP for password reset.
        """
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            AuthService.forgot_password(serializer.validated_data["identifier"])
            return Response({"message": "OTP sent for password reset"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

        if not user:
            return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if OTPService.verify_otp(user, serializer.validated_data["otp"], purpose="reset_password"):
            AuthService.reset_password(user, serializer.validated_data["new_password"])
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

        return Response({"message": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
