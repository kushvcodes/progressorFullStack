import os
import django
from django.core.asgi import get_asgi_application

# Set default settings module before any imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'progressor.settings.development')

# Initialize Django first
django.setup()

# Now import other dependencies
from channels.routing import ProtocolTypeRouter, URLRouter
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from apps.chat import routing

class DjoserAuthMiddleware:
    def __init__(self, app):
        self.app = app
        self.jwt_authentication = JWTAuthentication()

    async def __call__(self, scope, receive, send):
        scope['user'] = await self.get_valid_user(scope)
        return await self.app(scope, receive, send)

    async def get_valid_user(self, scope):
        try:
            query_params = parse_qs(scope["query_string"])
            token = query_params.get(b'token', [b''])[0].decode('utf-8')
            
            if not token:
                return AnonymousUser()
                
            validated_token = await self.validate_token(token)
            user = await self.get_user_from_token(validated_token)
            return user or AnonymousUser()
            
        except (InvalidToken, TokenError) as e:
            print(f"Token validation failed: {str(e)}")
            return AnonymousUser()
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return AnonymousUser()

    @database_sync_to_async
    def validate_token(self, token):
        return self.jwt_authentication.get_validated_token(token)

    @database_sync_to_async
    def get_user_from_token(self, validated_token):
        try:
            return self.jwt_authentication.get_user(validated_token)
        except Exception:
            return None

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": DjoserAuthMiddleware(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})