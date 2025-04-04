# users/models.py
import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model with email as the unique identifier"""
    # Primary key using BigAutoField
    pkid = models.BigAutoField(primary_key=True, editable=False)
    # UUID for public identification
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    # Username field
    username = models.CharField(verbose_name=_("Username"), max_length=255, unique=True)
    # First name field
    first_name = models.CharField(
        verbose_name=_("First Name"), max_length=50, default=username
    )
    # Last name field
    last_name = models.CharField(verbose_name=_("Last Name"), max_length=50, default="")
    # Email field (used as login identifier)
    email = models.EmailField(verbose_name=_("Email Address"), unique=True)
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
        """Return username as short name"""
        return self.username
