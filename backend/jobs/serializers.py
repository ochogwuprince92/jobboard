from rest_framework import serializers
from .models import Job, JobTag, JobApplication
from employers.models import Employer
from employers.serializers import EmployerSerializer

class JobTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTag
        fields = ["id", "name"]

class JobSerializer(serializers.ModelSerializer):
    tags = JobTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=JobTag.objects.all(), many=True, write_only=True, source="tags", required=False
    )
    company = EmployerSerializer(read_only=True) # Nested serializer for company details
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Employer.objects.all(), write_only=True, source="company", required=True
    )

    class Meta:
        model = Job
        fields = [
            "id", "title", "company", "company_id", "location", "description", "requirements",
            "min_salary", "max_salary", "employment_type", "posted_by", "tags", "tag_ids",
            "is_active", "posted_at"
        ]
        read_only_fields = ["posted_by", "posted_at"]

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source="applicant.get_full_name", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["status", "applied_at", "applicant_name", "job_title"]
