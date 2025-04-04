from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    # List and create tasks
    path("api/tasks/", views.TaskListCreateView.as_view(), name="task-list"),
    # Retrieve, update and delete individual tasks
    path("api/tasks/<uuid:pk>/", views.TaskDetailView.as_view(), name="task-detail"),
]

# Add format suffix support (.json, .api, etc.)
urlpatterns = format_suffix_patterns(urlpatterns)
