from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    VerifyEmailView,
    LoginView,
    ForgotPasswordView,
    ResetPasswordView,
    ResendVerificationView,
    UserProfileView,
    LogoutView,
)

app_name = "users"

urlpatterns = [
    # Authentication endpoints
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", LoginView.as_view(), name="login"),
    path("registration/", RegisterView.as_view(), name="register"),
    path("registration/verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path(
        "registration/resend-email/",
        ResendVerificationView.as_view(),
        name="resend-verification",
    ),
    path("user/", UserProfileView.as_view(), name="user-profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password/reset/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("password/reset/confirm/", ResetPasswordView.as_view(), name="reset-password"),
]
