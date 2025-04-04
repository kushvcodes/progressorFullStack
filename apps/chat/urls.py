# apps/chat/urls.py
from django.urls import path
from .views import ChatHistoryAPI

urlpatterns = [
    # API Endpoint (React will use this)
    path('api/messages/', ChatHistoryAPI.as_view(), name='message-history'),
    
    # Optional: Keep the template view for admin/testing
    # path('chat/', views.chat, name='chat-template'), 
]