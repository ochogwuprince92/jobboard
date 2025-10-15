import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

# Set default Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "jobboard.settings")

app = Celery("jobboard")

# Load settings from Django settings.py with CELERY_ prefix
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in all installed apps
app.autodiscover_tasks(["users", "jobs", "resumes", "employers", "scraper"])

@app.task(bind=True)
def debug_task(self):
    print(f"Celery task running: {self.request!r}")


app.conf.beat_schedule = {
    "daily-scrape-jobs": {
        "task": "scraper.tasks.run_all_scrapers_task",
        "schedule": crontab(hour=3, minute=0),  # 3 AM daily
        "args": (),  # can pass default keyword/location
    },
}