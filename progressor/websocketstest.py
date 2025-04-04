import asyncio
import websockets
import json
import requests
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_websocket_connection():
    # Configuration
    BASE_URL = "http://localhost:8000"
    TEST_EMAIL = "motulotu@gmail.com"
    TEST_PASSWORD = "motu123456"
    
    # 1. Get JWT token
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/jwt/create/",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=5
        )
        response.raise_for_status()
        token = response.json()["access"]
        logger.info("✅ Successfully obtained JWT token")
    except Exception as e:
        logger.error(f"❌ Failed to get JWT token: {str(e)}")
        return
    
    # 2. Test WebSocket connection
    test_cases = [
        ("Valid token", f"ws://localhost:8000/ws/chat/?token={token}"),
        ("Invalid token", "ws://localhost:8000/ws/chat/?token=invalid.token.here"),
        ("No token", "ws://localhost:8000/ws/chat/")
    ]
    
    for description, uri in test_cases:
        logger.info(f"\n{'='*50}")
        logger.info(f"Testing: {description}")
        logger.info(f"Connecting to: {uri}")
        
        try:
            async with websockets.connect(uri, ping_interval=20, ping_timeout=5) as websocket:
                logger.info("✅ WebSocket connection successful!")
                
                # Wait for welcome message
                welcome = await websocket.recv()
                logger.info(f"Received welcome: {welcome}")
                
                # Send test message
                test_msg = {
                    "message": f"Test at {datetime.now().isoformat()}",
                    "type": "message"
                }
                await websocket.send(json.dumps(test_msg))
                logger.info(f"Sent: {test_msg}")
                
                # Keep connection alive and listen
                try:
                    while True:
                        response = await websocket.recv()
                        logger.info(f"Received: {response}")
                        break
                except websockets.exceptions.ConnectionClosedOK:
                    logger.info("Connection closed normally")
                except Exception as e:
                    logger.error(f"Error during receive: {str(e)}")
                    
        except Exception as e:
            logger.error(f"❌ Connection failed: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_websocket_connection())