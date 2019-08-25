import os
import json

from celery import Celery
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_room_server.settings')

app = Celery('chat_room_server')
app.config_from_object('django.conf:settings', namespace='CELERY')


@app.task(bind=True)
def debug_task(self):
    print('Request: {!r}'.format(self.request))


@app.task
def message_notify(msg_dict):
    channel_layer = get_channel_layer()

    message_payload = {
        'type': 'chat.message',
        'text': json.dumps({
            'username': msg_dict['sender'],
            'content': msg_dict['content'],
            'id': str(msg_dict['id']),
            'timestamp': msg_dict['created']
        })
    }

    async_to_sync(channel_layer.group_send)('chat', message_payload)
