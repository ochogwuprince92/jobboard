#!/usr/bin/env python
import os
import django
import sys

# Add the backend directory to Python path
sys.path.insert(0, "/home/ochogwuprince/jobboard/backend")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobboard.settings")
django.setup()

from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site
from django.urls import reverse

print("=== OAUTH DEBUGGING ===")
print()

# Check site configuration
try:
    site = Site.objects.get(id=1)
    print(f"Site domain: {site.domain}")
except Exception as e:
    print(f"Error getting site: {e}")
print()

# Check social apps
try:
    apps = SocialApp.objects.all()
    for app in apps:
        print(f"{app.provider}:")
        print(f"  Name: {app.name}")
        print(
            f'  Client ID: {"***" + app.client_id[-4:] if app.client_id else "NOT SET"}'
        )
        print(f'  Secret: {"***" + app.secret[-4:] if app.secret else "NOT SET"}')
        sites = app.sites.all()
        print(f"  Sites: {[s.domain for s in sites]}")
        print()
except Exception as e:
    print(f"Error getting social apps: {e}")

print("=== URL CONFIGURATION ===")
try:
    google_url = reverse("google_login")
    print(f"Google login URL: {google_url}")
except Exception as e:
    print(f"Error getting Google URL: {e}")

print()
print("=== CALLBACK URLS ===")
from jobboard.urls import GoogleLogin, GithubLogin, LinkedInLogin

print(f"Google callback: {GoogleLogin.callback_url}")
print(f"GitHub callback: {GithubLogin.callback_url}")
print(f"LinkedIn callback: {LinkedInLogin.callback_url}")
