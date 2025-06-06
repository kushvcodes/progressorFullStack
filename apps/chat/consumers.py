import asyncio
import json
import logging
from datetime import datetime

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from google import genai

from .command_processor import process_message
from .models import Message

logger = logging.getLogger(__name__)

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection and authentication"""
        self.user = self.scope["user"]
        self.keep_alive = True

        if not self.user.is_authenticated:
            logger.warning("Rejected connection - unauthenticated user")
            await self.close(code=4003)
            return

        try:
            self.ai_user = await sync_to_async(User.objects.get)(username="AI")
            self.room_group_name = f"chat_{self.user.id}_{self.ai_user.id}"

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()

            await self.send_json(
                {
                    "type": "system",
                    "message": f"Connected as {self.user.username}",
                    "timestamp": datetime.now().isoformat(),
                }
            )

            logger.info(f"WebSocket connected for {self.user.username}")

        except Exception as e:
            logger.error(f"Connection error: {str(e)}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        self.keep_alive = False
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name, self.channel_name
            )
        logger.info(f"WebSocket disconnected (code: {close_code})")

    async def receive(self, text_data):
        """Process incoming WebSocket messages"""
        try:
            data = json.loads(text_data)

            if data.get("type") == "ping":
                await self.send_json({"type": "pong"})
                return

            message = data.get("message")
            if message:
                await self.handle_message(message)

        except json.JSONDecodeError:
            logger.warning("Received invalid JSON")
        except Exception as e:
            logger.error(f"Message handling error: {str(e)}")
            await self.send_json(
                {"type": "error", "message": "Failed to process message"}
            )

    async def send_json(self, data):
        """Send JSON data through WebSocket"""
        await self.send(text_data=json.dumps(data))

    async def handle_message(self, message):
        """Process user message and generate AI response"""
        # Save user message
        await self.save_message(self.user, self.ai_user, message)

        # Process through command processor
        ai_response = await sync_to_async(process_message)(self.user, message)

        # Save and send AI response
        await self.save_message(self.ai_user, self.user, ai_response)
        await self.send_json(
            {
                "type": "message",
                "sender": "AI",
                "content": ai_response,
                "timestamp": datetime.now().isoformat(),
            }
        )

    @sync_to_async
    def save_message(self, sender, receiver, content):
        """Save message to database"""
        Message.objects.create(sender=sender, receiver=receiver, content=content)

    async def keep_alive(self):
        """Send periodic pings to keep connection alive"""
        while self.keep_alive:
            await asyncio.sleep(30)
            try:
                await self.send_json({"type": "ping"})
            except:
                self.keep_alive = False
