# apps/chat/views.py
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer

User = get_user_model()


class ChatHistoryAPI(generics.ListAPIView):
    """API endpoint to fetch chat history between user and AI"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get messages between current user and AI"""
        queryset = Message.objects.filter(
            Q(sender=self.request.user, receiver__username="AI")
            | Q(sender__username="AI", receiver=self.request.user)
        ).order_by("timestamp")

        # Apply search filter if provided
        search_query = self.request.query_params.get("search", None)
        if search_query:
            queryset = queryset.filter(content__icontains=search_query)

        return queryset

    def list(self, request, *args, **kwargs):
        """Return messages with last message highlighted"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(
            {
                "messages": serializer.data,
                "last_message": serializer.data[-1] if queryset.exists() else None,
            }
        )
