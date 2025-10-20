from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    LogoutSerializer,
    VerifyEmailSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    ResendVerificationSerializer,
    UserSerializer
)
from .services import AuthService, OTPService
from .repository import UserRepository

# -----------------------------
# User Registration
# -----------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = AuthService.register(
            email=data.get('email'),
            phone_number=data.get('phone_number'),
            password=data.get('password'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name')
        )
        return Response(
            {"message": "User registered successfully. Please verify OTP or email."},
            status=status.HTTP_201_CREATED
        )


# -----------------------------
# User Login
# -----------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')
        password = serializer.validated_data.get('password')

        try:
            tokens = AuthService.login(identifier, password)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(tokens, status=status.HTTP_200_OK)


# -----------------------------
# Verify Email / OTP (GET)
# -----------------------------
class VerifyEmailView(APIView):
    """
    Handles both:
    - GET: Email verification via token in URL (e.g., from email link)
    - POST: OTP verification for email/phone users
    """
    permission_classes = [AllowAny]

    # --- Email verification via link ---
    def get(self, request):
        token = request.query_params.get('token')

        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = AuthService.verify_email(token)
            user.is_verified = True
            user.save()
            return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # --- OTP verification (for phone or email OTPs) ---
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')
        token = serializer.validated_data.get('token')
        purpose = serializer.validated_data.get('purpose')

        user = UserRepository.get_by_email_or_phone(identifier)
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if OTPService.verify_otp(user, token, purpose):
            if purpose == "register":
                user.is_verified = True
                user.save()
            return Response({"message": "Verification successful."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid or expired token/OTP."}, status=status.HTTP_400_BAD_REQUEST)
# -----------------------------
# Resend Verification
# -----------------------------
class ResendVerificationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResendVerificationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')
        user = UserRepository.get_by_email_or_phone(identifier)

        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        if user.is_verified:
            return Response({"error": "User already verified."}, status=status.HTTP_400_BAD_REQUEST)

        # Resend OTP or email verification
        if user.email:
            AuthService.resend_verification(user.email)
        else:
            OTPService.send_otp(user, "register")

        return Response({"message": "Verification sent successfully."}, status=status.HTTP_200_OK)


# -----------------------------
# Forgot Password
# -----------------------------
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')

        try:
            AuthService.forgot_password(identifier)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "OTP sent for password reset."}, status=status.HTTP_200_OK)


# -----------------------------
# Reset Password
# -----------------------------
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')
        otp = serializer.validated_data.get('otp')
        new_password = serializer.validated_data.get('new_password')

        user = UserRepository.get_by_email_or_phone(identifier)
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if not OTPService.verify_otp(user, otp, "reset_password"):
            return Response({"error": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        AuthService.reset_password(user, new_password)
        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)


# -----------------------------
# User Profile
# -----------------------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------
# Logout
# -----------------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token or already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)
