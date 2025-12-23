from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.sites.models import Site
import os


class Command(BaseCommand):
    help = "Create or update social application entries for allauth"

    def handle(self, *args, **options):
        # Try to import allauth models
        try:
            from allauth.socialaccount.models import SocialApp
        except ImportError:
            self.stdout.write(
                self.style.ERROR(
                    "django-allauth is not installed or not properly configured."
                )
            )
            return

        # Get the current site
        try:
            site = Site.objects.get(id=settings.SITE_ID)
        except Site.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(
                    f"Site with ID {settings.SITE_ID} does not exist. Creating it..."
                )
            )
            site = Site.objects.create(
                id=settings.SITE_ID, domain="localhost:8000", name="Job Board"
            )

        # Define the providers and their environment variable mappings
        providers = {
            "google": {
                "client_id_env": "SOCIAL_GOOGLE_CLIENT_ID",
                "secret_env": "SOCIAL_GOOGLE_SECRET",
                "name": "Google",
            },
            "github": {
                "client_id_env": "SOCIAL_GITHUB_CLIENT_ID",
                "secret_env": "SOCIAL_GITHUB_SECRET",
                "name": "GitHub",
            },
            "linkedin_oauth2": {
                "client_id_env": "SOCIAL_LINKEDIN_CLIENT_ID",
                "secret_env": "SOCIAL_LINKEDIN_SECRET",
                "name": "LinkedIn",
            },
        }

        created_count = 0
        updated_count = 0

        for provider, config in providers.items():
            client_id = os.getenv(config["client_id_env"])
            secret = os.getenv(config["secret_env"])

            if not client_id or not secret:
                self.stdout.write(
                    self.style.WARNING(
                        f'Skipping {config["name"]}: {config["client_id_env"]} or {config["secret_env"]} not set'
                    )
                )
                continue

            # Check if SocialApp already exists
            social_app, created = SocialApp.objects.get_or_create(
                provider=provider,
                defaults={
                    "name": config["name"],
                    "client_id": client_id,
                    "secret": secret,
                },
            )

            if created:
                social_app.sites.add(site)
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created {config["name"]} social app')
                )
            else:
                # Update existing app
                social_app.client_id = client_id
                social_app.secret = secret
                social_app.name = config["name"]
                social_app.save()

                # Ensure site is associated
                if not social_app.sites.filter(id=site.id).exists():
                    social_app.sites.add(site)

                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Updated {config["name"]} social app')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Social apps setup complete: {created_count} created, {updated_count} updated"
            )
        )
