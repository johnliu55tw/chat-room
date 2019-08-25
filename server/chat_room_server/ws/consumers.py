import uuid
import json
import time
import logging

from channels.generic.websocket import AsyncJsonWebsocketConsumer

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        logger.warning('Connected!')
        await self.accept()
        await self.channel_layer.group_add('chat', self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('chat', self.channel_name)

    async def receive_json(self, data):
        logger.warning('Received from client: {}'.format(data))
        user_name = data['user_name']
        message = data['content']

        msg_id = uuid.uuid4()

        message_payload = {
            'type': 'chat.message',
            'text': json.dumps({
                'username': user_name,
                'content': message,
                'id': str(msg_id),
                'timestamp': time.time()
            })
        }

        await self.channel_layer.group_send('chat', message_payload)

    async def chat_message(self, event):
        logger.warning('Sent to client: {}'.format(event))
        await self.send(event['text'])
