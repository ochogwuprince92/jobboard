# scraper/repository.py
from jobs.models import Job
from django.db import IntegrityError

class JobRepository:
    """
    Repository to handle saving jobs to the database.
    Includes duplicate detection based on title + company + location.
    """

    @staticmethod
    def save_job(job_data: dict):
        """
        Save a job to the database if it doesn't already exist.
        :param job_data: dict with keys: title, company, location, description, salary, employment_type, source
        :return: Job instance or None if duplicate
        """
        # Check for duplicates
        existing = Job.objects.filter(
            title=job_data["title"],
            company=job_data["company"],
            location=job_data["location"],
        ).first()
        if existing:
            return None  # Duplicate, skip

        # Save new job
        try:
            job = Job.objects.create(
                title=job_data.get("title"),
                company=job_data.get("company"),
                location=job_data.get("location"),
                description=job_data.get("description", ""),
                requirements=job_data.get("requirements", ""),
                salary=job_data.get("salary"),
                employment_type=job_data.get("employment_type", "Full-time"),
                posted_by=job_data.get("posted_by"),  # optional, can be admin user
                is_active=True,
            )
            return job
        except IntegrityError:
            return None
