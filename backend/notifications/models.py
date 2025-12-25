from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("application_received", "Application Received"),
        ("application_status_changed", "Application Status Changed"),
        ("job_posted", "Job Posted"),
        ("profile_viewed", "Profile Viewed"),
        ("message_received", "Message Received"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Optional related objects
    related_job = models.ForeignKey(
        "jobs.Job", on_delete=models.CASCADE, null=True, blank=True
    )
    related_application = models.ForeignKey(
        "jobs.JobApplication", on_delete=models.CASCADE, null=True, blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title}"
