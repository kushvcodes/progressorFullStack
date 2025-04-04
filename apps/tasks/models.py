import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class Task(models.Model):
    """Task model for managing user tasks and todos"""
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    )

    PRIORITY_CHOICES = (
        ("vl", "Very low."),
        ("l", "Low."),
        ("n", "Normal :)"),
        ("h", "High!"),
        ("vh", "Very High!!"),
    )

    CATEGORY_CHOICES = (
        ("e", "emergency"),
        ("f", "family"),
        ("h", "home"),
        ("p", "personal"),
        ("s", "social"),
        ("w", "work"),
    )

    # Unique identifier for the task
    id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True, primary_key=True
    )
    # Task owner
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks"
    )
    # Task title
    title = models.CharField(max_length=255)
    # Detailed description
    description = models.TextField(blank=True, null=True)
    # Current status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    # Estimated points (difficulty score)
    est_points = models.IntegerField(default=10)
    # Estimated time in minutes
    est_time = models.IntegerField(default=30)
    # Creation timestamp
    created_at = models.DateTimeField(default=timezone.now)
    # Last update timestamp
    updated_at = models.DateTimeField(auto_now=True)
    # When the task is due
    due_date = models.DateTimeField(null=True, blank=True)
    # When the task was started
    start_date = models.DateTimeField(null=True, blank=True)
    # When the task was completed
    completed_date = models.DateTimeField(null=True, blank=True)
    # Task category
    category = models.TextField(choices=CATEGORY_CHOICES)
    # Task priority
    priority = models.TextField(default="normal", choices=PRIORITY_CHOICES)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
