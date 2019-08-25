import os
import time

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_room_server.settings')

app = Celery('chat_room_server')
app.config_from_object('django.conf:settings', namespace='CELERY')


@app.task(bind=True)
def debug_task(self):
    print('Request: {!r}'.format(self.request))


@app.task
def message_notify(msg_dict):
    time.sleep(5)
    with open('/tmp/test', 'w') as f:
        f.write(str(type(msg_dict)) + '\n')
        f.write(str(msg_dict))
