from rest_framework import serializers
from .models import ScrapedJob


class ScrapedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedJob
        fields = [
            'id', 'title', 'company_name', 'location', 
            'description', 'job_url', 'posted_date', 
            'source_website', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
