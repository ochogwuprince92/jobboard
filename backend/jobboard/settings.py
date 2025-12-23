import os
from pathlib import Path
from datetime import timedelta
import environ

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------
# ENVIRONMENT
# -----------------------
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("SECRET_KEY")
JWT_SECRET_KEY = env("JWT_SECRET_KEY")
DEBUG = True
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# -----------------------
# STATIC & MEDIA
# -----------------------
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# -----------------------
# CORS
# -----------------------
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
)

# -----------------------
# DATABASE
# -----------------------
DATABASES = {"default": env.db("DATABASE_URL")}

# -----------------------
# REDIS / CELERY
# -----------------------
CELERY_ENABLED = env.bool("CELERY_ENABLED", default=False)
REDIS_URL = env("REDIS_URL", default="redis://localhost:6379/0")
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Africa/Lagos"

# -----------------------
# INSTALLED APPS
# -----------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_filters",
    "corsheaders",
    "drf_spectacular",
    "django_celery_beat",
    "django_extensions",
    # Sites framework (required by django-allauth)
    "django.contrib.sites",
    # Project apps
    "core",
    "users",
    "jobs",
    "employers",
    "resumes",
    "ai",
    "scraper",
    "notifications",
    # -----------------------
    # Social Auth / Allauth
    # -----------------------
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    # social providers
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",
    "allauth.socialaccount.providers.linkedin_oauth2",
    # "allauth.socialaccount.providers.facebook",
    # dj-rest-auth (REST endpoints that integrate with allauth)
    "dj_rest_auth",
    "dj_rest_auth.registration",
]

# -----------------------
# MIDDLEWARE
# -----------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",  # Required by allauth
]

ROOT_URLCONF = "jobboard.urls"

# Sites framework
SITE_ID = env.int("SITE_ID", default=1)

# -----------------------
# TEMPLATES
# -----------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "jobboard.wsgi.application"

# -----------------------
# AUTHENTICATION
# -----------------------
AUTH_USER_MODEL = "users.User"
AUTHENTICATION_BACKENDS = [
    "users.backends.EmailOrPhoneModelBackend",  # Custom backend
    "django.contrib.auth.backends.ModelBackend",  # default fallback
    "allauth.account.auth_backends.AuthenticationBackend",  # allauth backend
]

# -----------------------
# REST FRAMEWORK
# -----------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

# -----------------------
# SIMPLE JWT SETTINGS
# -----------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# -----------------------
# EMAIL
# -----------------------
# Allow overriding the email backend via env. Default to console backend in
# DEBUG (development) to avoid hard failures when SMTP is not configured.
if DEBUG:
    EMAIL_BACKEND = env(
        "EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
    )
else:
    EMAIL_BACKEND = env(
        "EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend"
    )

# Only read SMTP-specific settings when using the SMTP backend. This avoids
# raising errors when env vars for SMTP are missing in development.
if "smtp" in EMAIL_BACKEND:
    EMAIL_HOST = env("EMAIL_HOST")
    EMAIL_PORT = env.int("EMAIL_PORT")
    EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")

# Default from address (can still be provided via env)
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="noreply@localhost")

# Control whether send_mail should fail silently. Default to True in DEBUG
# to prevent registration from returning 500s when email delivery fails.
EMAIL_FAIL_SILENTLY = env.bool("EMAIL_FAIL_SILENTLY", default=DEBUG)

# -----------------------
# OTP Settings
# -----------------------
OTP_EXPIRATION_MINUTES = env.int("OTP_EXPIRATION_MINUTES", default=10)

# -----------------------
# DRF SPECTACULAR
# -----------------------
SPECTACULAR_SETTINGS = {
    "TITLE": "Job Board API",
    "DESCRIPTION": "API with email/phone authentication, jobs, resumes, AI features",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_GENERATOR_CLASS": "jobboard.custom_schema.CustomSchemaGenerator",
}

auth_user_model = "users.User"

# URL of your frontend application for email verification links
FRONTEND_URL = "http://localhost:3000"  # or your production frontend URL

# -----------------------
# django-allauth / socialaccount provider settings
# -----------------------
# Minimal provider configuration — client IDs/secrets are expected to be
# created in the Django admin or via the management command `create_social_apps`.
# SOCIALACCOUNT_PROVIDERS = {
#     "google": {
#         "SCOPE": ["openid", "email", "profile"],
#         "AUTH_PARAMS": {"access_type": "online"},
#     },
#     "github": {
#         "SCOPE": ["user:email"],
#     },
#     "linkedin_oauth2": {
#         "SCOPE": ["r_liteprofile", "r_emailaddress"],
#     },
#     "facebook": {
#         "METHOD": "oauth2",
#         "SCOPE": ["email"],
#     },
# }

# -----------------------
# django-allauth / socialaccount provider settings
# -----------------------
# Minimal provider configuration — client IDs/secrets are expected to be
# created in the Django admin or via the management command `create_social_apps`.
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["openid", "email", "profile"],
        "AUTH_PARAMS": {"access_type": "online"},
    },
    "github": {
        "SCOPE": ["user:email"],
    },
    "linkedin_oauth2": {
        "SCOPE": ["r_liteprofile", "r_emailaddress"],
    },
    # "facebook": {
    #     "METHOD": "oauth2",
    #     "SCOPE": ["email"],
    # },
}

# Allauth: don't force account adapter changes here. Keep defaults that
# preserve current registration behavior. Minimal tweaks below:
ACCOUNT_EMAIL_VERIFICATION = "optional"
SOCIALACCOUNT_QUERY_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = "username"
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
