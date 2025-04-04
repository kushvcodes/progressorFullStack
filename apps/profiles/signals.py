import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.profiles.models import Profile
from progressor.settings.base import AUTH_USER_MODEL

logger = logging.getLogger(__name__)


@receiver(post_save, sender=AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a profile when a new user is created"""
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Save the user profile when the user is saved"""
    instance.profile.save()
    logger.info(f"{instance}'s profile created")
