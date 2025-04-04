from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Display username instead of ID

    class Meta:
        model = Task
        fields = ["id", "user", "title", "description", "status", "created_at", "updated_at", "due_date",
                  "category", "priority", "est_points", "est_time", "start_date"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
