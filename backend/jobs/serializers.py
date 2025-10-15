from rest_framework import serializers
from .models import Job, JobTag, JobApplication

class JobTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTag
        fields = ["id", "name"]

class JobSerializer(serializers.ModelSerializer):
    tags = JobTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
    queryset=JobTag.objects.all(), many=True, write_only=True, source="tags", required=False
   
    )

    class Meta:
        model = Job
        fields = ["id", "title", "company", "location", "description", "requirements", "salary", "employment_type", "posted_by", "tags", "tag_ids", "is_active", "posted_at"]
        read_only_fields = ["posted_by", "posted_at"]

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source="applicant.get_full_name", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["status", "applied_at", "applicant_name", "job_title"]
