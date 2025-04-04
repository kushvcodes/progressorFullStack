# apps/chat/urls.py
from django.urls import path

from .views import ChatHistoryAPI

urlpatterns = [
    # API Endpoint (for react)
    path("api/messages/", ChatHistoryAPI.as_view(), name="message-history"),
]
