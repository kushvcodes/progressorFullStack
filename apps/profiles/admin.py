from django.contrib import admin

from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for Profile model
    
    Attributes:
        list_display: Fields to display in admin list view
        list_filter: Fields available for filtering in admin
        list_display_links: Fields that link to change form
    """
    list_display = ["id", "pkid", "user", "gender", "country", "city"]
    list_filter = ["gender", "country", "city"]
    list_display_links = ["id", "pkid", "user"]


admin.site.register(Profile, ProfileAdmin)
