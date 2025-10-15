from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Employer
from .serializers import EmployerSerializer
from .permissions import IsEmployerOrReadOnly
from rest_framework.exceptions import ValidationError

class EmployerViewSet(viewsets.ModelViewSet):
    queryset = Employer.objects.all().select_related("user")
    serializer_class = EmployerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # allow filtering and sorting
    filterset_fields = ["industry", "location", "is_verified"]
    search_fields = ["company_name", "description", "industry", "location"]
    ordering_fields = ["created_at", "company_name"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        elif self.action in ["create", "update", "partial_update", "me"]:
            return [IsAuthenticated()]
        return [IsEmployerOrReadOnly()]

    def perform_create(self, serializer):
        # Prevent creating multiple employer profiles
        if hasattr(self.request.user, "employer_profile"):
            raise ValidationError({"detail": "Employer profile already exists."})
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Return the authenticated employer’s own profile."""
        employer = getattr(request.user, "employer_profile", None)
        if not employer:
            return Response({"detail": "No employer profile found."}, status=404)
        serializer = self.get_serializer(employer)
        return Response(serializer.data)
