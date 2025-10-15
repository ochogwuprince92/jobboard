# filters.py (create this inside your jobs app)
import django_filters
from .models import Job

class JobFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    location = django_filters.CharFilter(field_name="location", lookup_expr="icontains")
    company = django_filters.CharFilter(field_name="company", lookup_expr="icontains")

    class Meta:
        model = Job
        fields = ["title", "location", "company", "employment_type", "tags"]
