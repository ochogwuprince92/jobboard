from rest_framework import viewsets, filters, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import (
    PageNumberPagination,
)  # Import PageNumberPagination
from .models import Job, JobApplication, SavedJob
from .serializers import JobSerializer, JobApplicationSerializer, SavedJobSerializer
from .permissions import IsEmployer, IsEmployerOrApplicant
from .filters import JobFilter


# -----------------------------
# Job ViewSet
# -----------------------------
class JobViewSet(viewsets.ModelViewSet):
    queryset = (
        Job.objects.filter(is_active=True)
        .select_related("company")
        .order_by("-posted_at")
    )  # Select related company
    serializer_class = JobSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = JobFilter
    search_fields = [
        "title",
        "description",
        "requirements",
        "company__company_name",
        "location",
    ]  # Update search fields
    ordering_fields = [
        "posted_at",
        "min_salary",
        "max_salary",
        "company__company_name",
    ]  # Update ordering fields
    pagination_class = PageNumberPagination  # built-in DRF pagination

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsEmployer()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        # Ensure the posted_by user is an employer
        if not self.request.user.is_employer:
            raise ValidationError({"detail": "Only employers can post jobs."})
        serializer.save(posted_by=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()

        # If user is an employer, only show their jobs
        if self.request.user.is_authenticated and getattr(
            self.request.user, "is_employer", False
        ):
            qs = qs.filter(posted_by=self.request.user)

        # Filtering is now handled by DjangoFilterBackend and JobFilter
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


# -----------------------------
# Job Application ViewSet
# -----------------------------
class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-applied_at")
    serializer_class = JobApplicationSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["job", "status"]
    search_fields = ["job__title", "applicant__first_name", "applicant__last_name"]
    ordering_fields = ["applied_at", "status"]

    def get_queryset(self):
        qs = super().get_queryset()

        # Filter applications based on user role
        if self.request.user.is_authenticated:
            if getattr(self.request.user, "is_employer", False):
                # Employers see applications to their jobs
                qs = qs.filter(job__posted_by=self.request.user)
            else:
                # Job seekers see their own applications
                qs = qs.filter(applicant=self.request.user)

        return qs

    def get_permissions(self):
        if self.action in ["create"]:
            return [IsAuthenticatedOrReadOnly()]
        else:
            return [IsAuthenticatedOrReadOnly(), IsEmployerOrApplicant()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    def perform_update(self, serializer):
        # Employers can only update status
        if getattr(self.request.user, "is_employer", False):
            # Only allow status updates for employers
            if set(self.request.data.keys()) == {"status"}:
                serializer.save()
            else:
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied("Employers can only update application status.")
        else:
            # Applicants can update other fields but not status
            if "status" in self.request.data:
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied("You cannot update application status.")
            serializer.save()


# -----------------------------
# Saved Job ViewSet
# -----------------------------
class SavedJobViewSet(viewsets.ModelViewSet):
    queryset = SavedJob.objects.all().order_by("-saved_at")
    serializer_class = SavedJobSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["job"]
    search_fields = ["job__title", "job__company__company_name"]
    ordering_fields = ["saved_at"]

    def get_queryset(self):
        qs = super().get_queryset()

        # Users can only see their own saved jobs
        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)

        return qs

    def get_permissions(self):
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    lookup_field = "id"

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
