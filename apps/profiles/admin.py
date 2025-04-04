from django.contrib import admin

from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    """Admin configuration for Profile model"""
    list_display = ["id", "pkid", "user", "gender", "country", "city"]
    list_filter = ["gender", "country", "city"]
    list_display_links = ["id", "pkid", "user"]


admin.site.register(Profile, ProfileAdmin)
