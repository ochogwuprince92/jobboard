
"""
Celery tasks for job scraping.
This task runs all enabled scrapers and saves the results
into the jobs.Job model, avoiding duplicates.
"""

import time
from celery import shared_task
from django.db import IntegrityError
from jobs.models import Job
from scraper.services import ScraperService


@shared_task
def run_all_scrapers_task(keyword=None, location=None):
    """
    Celery task to run all scrapers and save jobs.
    :param keyword: Optional job keyword to search
    :param location: Optional location to filter jobs
    :return: Number of new jobs added
    """
    scraper_service = ScraperService(keyword=keyword, location=location)
    all_jobs = scraper_service.run_all_scrapers()

    new_jobs_count = 0

    for job_data in all_jobs:
        # Check for duplicates using title + company + location
        exists = Job.objects.filter(
            title=job_data.get("title"),
            company=job_data.get("company"),
            location=job_data.get("location")
        ).exists()

        if exists:
            continue

        try:
            Job.objects.create(
                title=job_data.get("title"),
                company=job_data.get("company"),
                location=job_data.get("location"),
                description=job_data.get("description", ""),
                salary=job_data.get("salary", None),
                employment_type=job_data.get("employment_type", "Full-time"),
                posted_by=None,  # or set a system user
                is_active=True
            )
            new_jobs_count += 1
        except IntegrityError:
            # Skip if there's a unique constraint violation
            continue
        except Exception as e:
            print(f"[Error] Saving job {job_data.get('title')}: {e}")
            continue

    print(f"Scraping finished: {len(all_jobs)} total, {new_jobs_count} new jobs added.")
    return new_jobs_count

@shared_task
def send_application_email_task(to_email, subject, body):
    # send email logic
    print(f"Sending email to {to_email}")
    return True