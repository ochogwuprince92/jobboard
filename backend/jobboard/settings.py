import os
from pathlib import Path
from datetime import timedelta
import environ
from django.conf import settings

# -----------------------
# BASE DIR
# -----------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------
# STATIC FILES (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
# -----------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Media files (Uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

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
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])
# In production, set ALLOWED_HOSTS to your domain(s)

# CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
])

# Allow all headers and methods for development
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

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
    "drf_spectacular",
    
    # # Social Auth
    # 'django.contrib.sites',
    # 'allauth',
    # 'allauth.account',
    # 'allauth.socialaccount',
    # 'allauth.socialaccount.providers.facebook',
    # 'allauth.socialaccount.providers.linkedin_oauth2',
    # 'allauth.socialaccount.providers.github',
    # 'dj_rest_auth',
    # 'dj_rest_auth.registration',

]

# -----------------------
# MIDDLEWARE
# -----------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware should be as high as possible
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",  # Required by django-allauth
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
# AUTH_PASSWORD_VALIDATORS = [
#     {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
#     {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
#     {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
#     {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
# ]

# Site ID for social authentication
SITE_ID = 1

# Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# # Social account settings
# SOCIALACCOUNT_PROVIDERS = {}

# # Only enable Facebook provider if the required environment variables are set
# if env('FACEBOOK_APP_ID', default='') and env('FACEBOOK_APP_SECRET', default=''):
#     SOCIALACCOUNT_PROVIDERS['facebook'] = {
#         'APP': {
#             'client_id': env('FACEBOOK_APP_ID'),
#             'secret': env('FACEBOOK_APP_SECRET'),
#             'key': ''
#         },
#         'SCOPE': ['email', 'public_profile'],
#         'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
#         'METHOD': 'oauth2',
#         'VERIFIED_EMAIL': True
#     },
#     'linkedin_oauth2': {
#         'APP': {
#             'client_id': env('LINKEDIN_CLIENT_ID', ''),
#             'secret': env('LINKEDIN_CLIENT_SECRET', ''),
#             'key': ''
#         },
#         'SCOPE': ['r_emailaddress', 'r_liteprofile'],
#         'PROFILE_FIELDS': ['id', 'first-name', 'last-name', 'email-address', 'picture-url', 'public-profile-url'],
#     },
#     'github': {
#         'APP': {
#             'client_id': env('GITHUB_CLIENT_ID', ''),
#             'secret': env('GITHUB_CLIENT_SECRET', ''),
#             'key': ''
#         },
#         'SCOPE': ['user:email'],
#     }

# JWT settings for social auth
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'access'
JWT_AUTH_REFRESH_COOKIE = 'refresh'
JWT_AUTH_HTTPONLY = False

# # Allauth settings
# ACCOUNT_EMAIL_REQUIRED = True
# ACCOUNT_EMAIL_VERIFICATION = 'optional'
# ACCOUNT_AUTHENTICATION_METHOD = 'email'  # Will be overridden by custom auth backend
# ACCOUNT_USERNAME_REQUIRED = False
# ACCOUNT_USER_MODEL_USERNAME_FIELD = None
# ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = True
# ACCOUNT_CONFIRM_EMAIL_ON_GET = True
# ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 1
# ACCOUNT_EMAIL_SUBJECT_PREFIX = '[JobBoard] '

# Custom authentication backends
AUTHENTICATION_BACKENDS = [
    'users.backends.EmailOrPhoneModelBackend',  # Our custom backend
    'django.contrib.auth.backends.ModelBackend',  # Fallback
]

# # dj-rest-auth settings
# REST_AUTH = {
#     'USE_JWT': True,
#     'JWT_AUTH_COOKIE': 'access',
#     'JWT_AUTH_REFRESH_COOKIE': 'refresh',
#     'JWT_AUTH_HTTPONLY': False,
#     'USER_DETAILS_SERIALIZER': 'users.serializers.UserSerializer',
#     'REGISTER_SERIALIZER': 'users.serializers.CustomRegisterSerializer',
#     'LOGIN_SERIALIZER': 'users.serializers.CustomLoginSerializer',
#     'PASSWORD_RESET_SERIALIZER': 'users.serializers.CustomPasswordResetSerializer',
#     'USERNAME_REQUIRED': False,
# }
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
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.IsAuthenticated',
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle"
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
        "login": "5/minute", # Custom throttle for login attempts
        "otp_request": "3/hour", # Custom throttle for OTP requests
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}


# JWT Settings for dj-rest-auth
# REST_USE_JWT = True
# JWT_AUTH = {
#     'JWT_SECRET_KEY': env("JWT_SECRET_KEY"),
#     'JWT_ALGORITHM': 'HS256',
#     'JWT_VERIFY': True,
#     'JWT_VERIFY_EXPIRATION': True,
#     'JWT_EXPIRATION_DELTA': timedelta(minutes=60),
#     'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
#     'JWT_AUTH_HEADER_PREFIX': 'Bearer',
#     'JWT_ALLOW_REFRESH': True,
#     'JWT_AUTH_COOKIE': 'access',
#     'JWT_AUTH_REFRESH_COOKIE': 'refresh',
#     'JWT_AUTH_HTTPONLY': True,
#     'JWT_AUTH_SAMESITE': 'Lax',
# }

# # dj-rest-auth settings
# REST_AUTH = {
#     'USE_JWT': True,
#     'JWT_AUTH_COOKIE': 'access',
#     'JWT_AUTH_REFRESH_COOKIE': 'refresh',
#     'JWT_AUTH_HTTPONLY': True,
#     'JWT_AUTH_SAMESITE': 'Lax',
#     'TOKEN_MODEL': None,  # We're using JWT, not token authentication
#     'JWT_AUTH_COOKIE_USE_CSRF': False,
#     'JWT_AUTH_RETURN_EXPIRATION': True,
#     'USER_DETAILS_SERIALIZER': 'users.serializers.UserSerializer',
#     'REGISTER_SERIALIZER': 'users.serializers.CustomRegisterSerializer',
#     'LOGIN_SERIALIZER': 'users.serializers.CustomLoginSerializer',
#     'PASSWORD_RESET_SERIALIZER': 'users.serializers.CustomPasswordResetSerializer',
#     'USERNAME_REQUIRED': False,
# }

AUTH_USER_MODEL = "users.User"

# OTP Settings
OTP_EXPIRATION_MINUTES = env.int("OTP_EXPIRATION_MINUTES", default=10)

# -----------------------
# DRF SPECTACULAR (Swagger/OpenAPI)
# -----------------------
SPECTACULAR_SETTINGS = {
    # Basic API Information
    "TITLE": "Job Board API",
    "DESCRIPTION": "A comprehensive job board platform with user authentication, job listings, applications, and AI-powered features",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    
    # Schema Generation
    "SCHEMA_PATH_PREFIX": "/api/",
    "SCHEMA_PATH_PREFIX_TRIM": True,
    "SCHEMA_COERCE_PATH_PK_SUFFIX": True,
    
    # Use custom schema generator
    "SCHEMA_GENERATOR_CLASS": "jobboard.custom_schema.CustomSchemaGenerator",
    
    # Component Settings
    "COMPONENT_SPLIT_REQUEST": True,
    "COMPONENT_NO_READ_ONLY_REQUIRED": True,
    "COMPONENT_NAME_CAMELIZE": False,
    
    # Authentication & Security
    "SECURITY_DEFINITIONS": {
        "JWT": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    },
    "SECURITY": [{"JWT": []}],
    
    # Preprocessing Hooks
    "PREPROCESSING_HOOKS": [
        'drf_spectacular.hooks.preprocess_exclude_path_format',
    ],
    
    # Swagger UI Settings
    "SWAGGER_UI_SETTINGS": {
        "persistAuthorization": True,
        "displayRequestDuration": True,
        "filter": "",
        "syntaxHighlight.theme": "monokai"
    },
    
    # Disable default auth classes for schema generation
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [],
}
