from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('api/tasks/', views.TaskListCreateView.as_view(), name='task-list'),
    path('api/tasks/<uuid:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)