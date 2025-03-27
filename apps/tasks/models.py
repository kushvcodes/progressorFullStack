import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone


class Task(models.Model):
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

    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    est_points = models.IntegerField(default=10)
    est_time = models.IntegerField(default=30)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    category = models.TextField(choices=CATEGORY_CHOICES)
    priority = models.TextField(default="normal", choices=PRIORITY_CHOICES)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
