from django.apps import AppConfig


class RatingsConfig(AppConfig):
    """
    Ratings application configuration
    
    Attributes:
        default_auto_field: Specifies the default auto field for models
        name: Specifies the application name
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.ratings"
