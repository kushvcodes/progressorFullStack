"""
Chat Message Model

Defines the database structure for storing chat messages between users and AI.
"""

# Django imports
from django.conf import settings
from django.db import models


class Message(models.Model):
    """
    Represents a chat message between users or between user and AI.
    
    Attributes:
        sender: User who sent the message
        receiver: User who received the message
        content: Text content of the message
        timestamp: When the message was created
    """
    
    # Message sender (foreign key to User model)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="sent_messages",
        on_delete=models.CASCADE
    )
    
    # Message receiver (foreign key to User model)
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="received_messages",
        on_delete=models.CASCADE,
    )
    
    # Message content
    content = models.TextField()
    
    # Timestamp of when message was sent
    timestamp = models.DateTimeField(auto_now_add=True,)

    def __str__(self):
        """String representation of the message"""
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"
