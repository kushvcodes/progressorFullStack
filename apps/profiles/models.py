from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField

from apps.common.models import TimeStampedUUIDModel

User = get_user_model()


class Gender(models.TextChoices):
    """Gender choices for user profiles"""
    MALE = "Male", _("Male")
    FEMALE = "Female", _("Female")
    OTHER = "Other", _("Other")


class Profile(TimeStampedUUIDModel):
    """User profile model with personal information"""
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)

    about_me = models.TextField(
        verbose_name=_("About me"), default="say something about yourself"
    )
    profile_photo = models.ImageField(
        verbose_name=_("Profile Photo"), default="/profile_default.png"
    )
    gender = models.CharField(
        verbose_name=_("Gender"),
        choices=Gender.choices,
        default=Gender.OTHER,
        max_length=20,
    )
    country = CountryField(
        verbose_name=_("Country"), default="DE", blank=False, null=False
    )
    city = models.CharField(
        verbose_name=_("City"),
        max_length=180,
        default="Berlin",
        blank=False,
        null=False,
    )
    is_student = models.BooleanField(
        verbose_name=_("Student"),
        default=False,
        help_text=_("Are you a Student?"),
    )
    is_adhd = models.BooleanField(
        verbose_name=_("ADHD"),
        default=False,
        help_text=_("Do you have ADHD?"),
    )

    rating = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
