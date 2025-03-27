#apps/chat/consumers.py

from django.contrib.auth import get_user_model 
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        user1 = self.scope['user'].username 
        ai_user = await sync_to_async(User.objects.get)(username="AI")  # Get the AI user from the database
        self.room_group_name = f"chat_{''.join(sorted([user1, ai_user.username]))}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = self.scope['user']  # The user sending the message
        ai_user = await sync_to_async(User.objects.get)(username="AI")  # Get the AI user


        await self.channel_layer.group_send(
        self.room_group_name,
        {
            'type': 'chat_message',
            'sender': sender.username,
            'receiver': ai_user.username,
            'message': message  # Send the user's message, not just AI's response
        }
    )
        
        # Save user message to AI
        await self.save_message(sender, ai_user, message)
        
        # Get AI's response (mocked for now)
        ai_response = self.get_ai_response(message)

        # Save AI's response to the user
        await self.save_message(ai_user, sender, ai_response)

        # Send the AI response back to the WebSocket
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'sender': ai_user.username,
                'receiver': sender.username,
                'message': ai_response  # The AI response
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'sender': sender,
            'receiver': receiver,
            'message': message
        }))

    @sync_to_async
    def save_message(self, sender, receiver, message):
        Message.objects.create(sender=sender, receiver=receiver, content=message)


    def get_ai_response(self, msg):
        from google import genai
        client = genai.Client(api_key="AIzaSyDtp_dY_SFfprBzIyFiLVnlWnfQKlXWHnU")
        response = client.models.generate_content(
                model="gemini-2.0-flash", contents=msg
             )

        return "Here is your message: "+response.text# Placeholder AI response
