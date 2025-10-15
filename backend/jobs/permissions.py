from rest_framework.permissions import BasePermission

class IsEmployer(BasePermission):
    """Only employers can post/update jobs."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "is_employer", False)

class IsApplicantOrReadOnly(BasePermission):
    """Only the applicant can update their application; anyone can view."""
    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return obj.applicant == request.user
