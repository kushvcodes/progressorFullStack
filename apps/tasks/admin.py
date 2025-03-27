from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "status", "priority", "category", "created_at", "due_date")
    list_filter = ("status", "priority", "category", "created_at", "due_date")
    search_fields = ("title", "description", "user__username")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Info", {"fields": ("user", "title", "description")}),
        ("Status & Priority", {"fields": ("status", "priority", "category")}),
        ("Time Estimates", {"fields": ("est_points", "est_time")}),
        ("Dates", {"fields": ("created_at", "updated_at", "due_date", "start_date", "completed_date")}),
    )
