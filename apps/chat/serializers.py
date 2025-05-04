"""
Message Serializers

Defines serializers for chat message model to convert between Python objects and JSON.
"""

# Django REST framework imports
from rest_framework import serializers

# Local application imports
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model
    
    Handles serialization/deserialization of chat messages with related user fields.
    """
    
    # Represent sender/receiver as string (username)
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        """Metadata options for MessageSerializer"""
        model = Message
        fields = [
            "id",          # Message ID
            "sender",      # Sender username
            "receiver",    # Receiver username
            "content",     # Message text
            "timestamp"    # When message was sent
        ]
        read_only_fields = ["timestamp"]
