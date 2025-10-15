import os
from pathlib import Path
import environ
from django.conf import settings

# -----------------------
# BASE DIR
# -----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobboard.settings")
# -----------------------
# ENVIRONMENT SETUP
# -----------------------
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

# -----------------------
# SECRETS
# -----------------------
SECRET_KEY = env("SECRET_KEY")
JWT_SECRET_KEY = env("JWT_SECRET_KEY")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")
FRONTEND_URL = env("FRONTEND_URL")


# -----------------------
# SECURITY
# -----------------------
DEBUG = env.bool("DEBUG", default=False)
ALLOWED_HOSTS = ["*"]

CORS_ALLOW_CREDENTIALS = True

# -----------------------
# DATABASE
# -----------------------
DATABASES = {
    "default": env.db("DATABASE_URL")
}

# -----------------------
# REDIS / CELERY
# -----------------------
CELERY_ENABLED = env.bool("CELERY_ENABLED", default=False)
REDIS_URL = env("REDIS_URL")

# Celery broker & backend
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL

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
    
    # Project apps
    "core",
    "users",
    "jobs",
    "employers",
    "resumes",
    "ai",
    "scraper",
    "notifications",
    # Third-party apps
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_filters",
    "django_celery_beat",
    "django_extensions",
    "corsheaders",

]

# -----------------------
# MIDDLEWARE
# -----------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

]

ROOT_URLCONF = "jobboard.urls"

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
# PASSWORD VALIDATION
# -----------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -----------------------
# INTERNATIONALIZATION
# -----------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -----------------------
# STATIC FILES
# -----------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# -----------------------
# EMAIL (for OTP)
# -----------------------
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")


# Celery settings
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/0"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "Africa/Lagos"

# -----------------------
# REST FRAMEWORK + JWT
# -----------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}


# JWT Settings
SIMPLE_JWT = {
    "SIGNING_KEY": env("JWT_SECRET_KEY"),
}

AUTH_USER_MODEL = "users.User"
