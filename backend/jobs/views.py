from rest_framework import viewsets, filters, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from .permissions import IsEmployer, IsApplicantOrReadOnly
from .filters import JobFilter

# -----------------------------
# Job ViewSet
# -----------------------------
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True).order_by("-posted_at")
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter
    search_fields = ["title", "description", "requirements", "company", "location"]
    ordering_fields = ["posted_at", "salary", "company"]
    #kill -9pagination_class = PageNumberPagination  # built-in DRF pagination

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsEmployer()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        keyword = self.request.query_params.get("keyword")
        location = self.request.query_params.get("location")
        # Add filters for company, industry, etc.
        if keyword:
            qs = qs.filter(title__icontains=keyword)
        if location:
            qs = qs.filter(location__icontains=location)
        return qs

# -----------------------------
# Job Application ViewSet
# -----------------------------
class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all().order_by("-applied_at")
    serializer_class = JobApplicationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["job", "status"]
    search_fields = ["job__title", "applicant__first_name", "applicant__last_name"]
    ordering_fields = ["applied_at", "status"]

    def get_permissions(self):
        if self.action in ["create"]:
            return [IsAuthenticatedOrReadOnly()]
        else:
            return [IsAuthenticatedOrReadOnly(), IsApplicantOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)


class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    lookup_field = "id"
