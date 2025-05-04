# users/models.py
import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model with email as the unique identifier"""
    # Staff status
    is_staff = models.BooleanField(default=False)
    # Active status
    is_active = models.BooleanField(default=True)
    # When user joined
    date_joined = models.DateTimeField(default=timezone.now)
    # Productivity score
    present_productivity = models.IntegerField(default=0)
    
    # Use email as the username field for authentication
    USERNAME_FIELD = "email"
    # Required fields when creating a user
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    # Use custom manager for user creation
    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.username

    @property
    def get_full_name(self):
        """Return user's full name with proper capitalization"""
        return f"{self.first_name.title()} {self.last_name.title()}"

    def get_short_name(self):
        """
        Returns the username as a short identifier.
        
        Returns:
            str: The username
        """
        return self.username
