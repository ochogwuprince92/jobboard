from rest_framework.permissions import BasePermission


class IsEmployer(BasePermission):
    """Only employers can post/update jobs."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(
            request.user, "is_employer", False
        )


class IsEmployerOrApplicant(BasePermission):
    """Employers can update application status for their jobs; applicants can update their applications."""

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # Employers can update status for applications to their jobs
        if getattr(request.user, "is_employer", False):
            return obj.job.posted_by == request.user

        # Applicants can update their own applications
        return obj.applicant == request.user
