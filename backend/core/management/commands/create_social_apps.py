import os

from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = "Create or update SocialApp entries for configured social providers from environment variables."

    PROVIDERS = [
        ("google", "google"),
        ("github", "github"),
        ("linkedin_oauth2", "linkedin"),
        ("facebook", "facebook"),
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show which SocialApp entries would be created/updated without saving.",
        )

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False)

        try:
            from allauth.socialaccount.models import SocialApp
            from django.contrib.sites.models import Site
        except Exception as e:
            self.stderr.write(
                "django-allauth does not appear to be installed or configured: %s" % e
            )
            return

        site, _ = Site.objects.get_or_create(pk=getattr(settings, "SITE_ID", 1))

        for provider, env_prefix in self.PROVIDERS:
            client_id = os.environ.get(f"SOCIAL_{env_prefix.upper()}_CLIENT_ID")
            secret = os.environ.get(f"SOCIAL_{env_prefix.upper()}_SECRET")
            name = os.environ.get(f"SOCIAL_{env_prefix.upper()}_NAME", provider)

            if not client_id or not secret:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping {provider}: missing env vars SOCIAL_{env_prefix.upper()}_CLIENT_ID/_SECRET"
                    )
                )
                continue

            if dry_run:
                self.stdout.write(
                    f"Would create/update SocialApp for provider={provider} name={name}"
                )
                continue

            app, created = SocialApp.objects.get_or_create(provider=provider, name=name)
            app.client_id = client_id
            app.secret = secret
            # Optionally set key to empty
            app.key = ""
            app.save()
            app.sites.add(site)

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"Created SocialApp for {provider}")
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f"Updated SocialApp for {provider}")
                )

        self.stdout.write(self.style.NOTICE("Done"))
