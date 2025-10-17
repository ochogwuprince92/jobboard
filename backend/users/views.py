# apps/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from core.throttling import UserLoginRateThrottle # Import custom throttle
from .serializers import (
    RegisterSerializer, 
    CustomLoginSerializer as LoginSerializer, 
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from .services import AuthService, OTPService
from core.utils.email_otp import send_verification_email
from .repository import UserRepository
from .models import User, EmailOTP
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.backends import ModelBackend
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

# -----------------------------
# User Registration
# -----------------------------
class RegisterView(APIView):
    throttle_classes = [AnonRateThrottle]
    serializer_class = RegisterSerializer
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
    serializer_class = None  # No input serializer needed for GET request
    def get(self, request):
        """
        Verify email using the token link sent during registration.
        """
        token = request.query_params.get("token")
        if not token:
            return Response(
                {"message": "No verification token provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        print(f"Verification token received: {token}")
        
        try:
            print("Decoding token...")
            user_data = AuthService.decode_verification_token(token)
            print(f"Decoded token data: {user_data}")
            
            user = User.objects.get(id=user_data["user_id"])
            print(f"Found user: {user.email}")
            
            user.is_verified = True
            user.is_active = True
            user.save()
            print("User verified and activated successfully")
            
            return Response(
                {"message": "Email verified successfully."}, 
                status=status.HTTP_200_OK
            )
            
        except jwt.ExpiredSignatureError as e:
            print(f"Token expired: {str(e)}")
            return Response(
                {"message": "Verification link has expired. Please request a new one."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return Response(
                {"message": "Invalid verification link. Please check the link or request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except ObjectDoesNotExist:
            print(f"User not found for token: {token}")
            return Response(
                {"message": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        except Exception as e:
            print(f"Unexpected error during verification: {str(e)}")
            return Response(
                {"message": f"An error occurred during verification: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


# -----------------------------
# Login View
# -----------------------------
class LoginView(APIView):
    throttle_classes = [UserLoginRateThrottle]
    serializer_class = LoginSerializer # Apply custom throttle for login attempts
    
    def post(self, request):
        """
        Login via email or phone number.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # First, authenticate the user
            user = UserRepository.get_by_email_or_phone(serializer.validated_data['identifier'])
            
            if not user:
                return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
                
            if not user.check_password(serializer.validated_data['password']):
                return Response({"message": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)
                
            if not user.is_verified:
                return Response({
                    "message": "Email not verified. Please check your email for the verification link.",
                    "detail": "Email not verified"
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Explicitly use the first authentication backend
            backend = settings.AUTHENTICATION_BACKENDS[0]
            user = authenticate(
                request=request,
                username=user.username or user.email or user.phone_number,
                password=serializer.validated_data['password'],
                backend=backend
            )
            
            if user is not None:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                from .serializers import UserSerializer
                user_data = UserSerializer(user).data
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": user_data,
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)
            
        except Exception as e:
            return Response(
                {"message": f"An error occurred during login: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# -----------------------------
# Forgot Password
# -----------------------------
class ForgotPasswordView(APIView):
    throttle_classes = [AnonRateThrottle]
    serializer_class = ForgotPasswordSerializer # Apply throttle for anonymous users
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
# Resend Verification Email
# -----------------------------
class ResendVerificationView(APIView):
    throttle_classes = [AnonRateThrottle]
    serializer_class = ForgotPasswordSerializer  # Reusing as it has the same fields
    
    def post(self, request):
        """
        Resend verification email to the user.
        """
        email = request.data.get('email')
        if not email:
            return Response(
                {"message": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            user = User.objects.get(email=email)
            
            # Check if user is already verified
            if user.is_verified:
                return Response(
                    {"message": "Email is already verified"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Check if there's a recent OTP that hasn't expired
            recent_otp = EmailOTP.objects.filter(
                user=user,
                purpose='register',
                is_used=False,
                expires_at__gt=timezone.now()
            ).order_by('-created_at').first()
            
            if recent_otp:
                # If there's a recent OTP, don't send a new one
                return Response(
                    {
                        "message": "Verification email already sent. Please check your inbox.",
                        "resend_available_after": recent_otp.expires_at
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Generate and send new verification token
            token = AuthService.generate_verification_token(user)
            send_verification_email(user.email, token)
            
            return Response(
                {"message": "Verification email sent successfully"},
                status=status.HTTP_200_OK
            )
                
        except User.DoesNotExist:
            return Response(
                {"message": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": f"Failed to resend verification email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# -----------------------------
# Reset Password
# -----------------------------
class ResetPasswordView(APIView):
    serializer_class = ResetPasswordSerializer
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
