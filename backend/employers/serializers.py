from rest_framework import serializers
from .models import Employer

class EmployerSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Employer
        fields = [
            "id", "user_email", "company_name", "website", "description",
            "industry", "location", "logo", "is_verified", "created_at"
        ]
        read_only_fields = ["id", "is_verified", "created_at"]
