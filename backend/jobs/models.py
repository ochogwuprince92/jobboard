from django.db import models
from django.conf import settings

# -----------------------------
# Job Tag
# -----------------------------
class JobTag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# -----------------------------
# Job Model
# -----------------------------
class Job(models.Model):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERN = "Internship"

    EMPLOYMENT_TYPE_CHOICES = [
        (FULL_TIME, "Full-time"),
        (PART_TIME, "Part-time"),
        (CONTRACT, "Contract"),
        (INTERN, "Internship"),
    ]

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.TextField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tags = models.ManyToManyField(JobTag, blank=True)
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

# -----------------------------
# Job Application Model
# -----------------------------
class JobApplication(models.Model):
    PENDING = "Pending"
    REVIEWED = "Reviewed"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (REVIEWED, "Reviewed"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected"),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cover_letter = models.TextField()
    resume = models.FileField(upload_to="resumes/")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("job", "applicant")  # Prevent duplicate applications

    def __str__(self):
        return f"{self.applicant} -> {self.job}"
