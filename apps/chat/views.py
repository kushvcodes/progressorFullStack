# apps/chat/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatHistoryAPI(generics.ListAPIView):
    """API endpoint to fetch chat history between user and AI"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Message.objects.filter(
            Q(sender=self.request.user, receiver__username="AI") |
            Q(sender__username="AI", receiver=self.request.user)
        ).order_by('timestamp')
        
        # Optional search filter
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(content__icontains=search_query)
            
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'messages': serializer.data,
            'last_message': serializer.data[-1] if queryset.exists() else None
        })