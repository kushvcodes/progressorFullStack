from django.apps import AppConfig


class CommonConfig(AppConfig):
    """
    Configuration class for the common app.
    
    This app contains shared functionality and utilities
    used across other apps in the project.
    """
    
    # Use BigAutoField as default for model IDs
    default_auto_field = "django.db.models.BigAutoField"
    
    # App name must match the package name
    name = "apps.common"
