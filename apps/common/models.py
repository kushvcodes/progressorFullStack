import uuid

from django.db import models


class TimeStampedUUIDModel(models.Model):
    """Base model with UUID and timestamp fields for all models to inherit from"""
    # Primary key using BigAutoField for better performance
    pkid = models.BigAutoField(primary_key=True, editable=False)
    # UUID field for public IDs (safer for external use)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    # Creation timestamp
    created_at = models.DateTimeField(auto_now_add=True)
    # Last update timestamp
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
