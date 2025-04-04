from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET: List all tasks for the authenticated user.
    POST: Create a new task.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only tasks belonging to the current user"""
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the user when creating a task"""
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single task.
    PUT: Update a task.
    DELETE: Delete a task.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Ensure users can only access their own tasks"""
        return Task.objects.filter(user=self.request.user)
