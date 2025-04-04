from django.contrib import admin

from .models import Message

# Register Message model for admin interface
admin.site.register(Message)
