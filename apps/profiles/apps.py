from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    """Profiles application configuration"""
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.profiles"

    def ready(self):
        """Import signals when app is ready"""
        from apps.profiles import signals
