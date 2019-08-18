import uuid

from django.db import models


class UserMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(
        'auth.User',
        related_name='messages',
        on_delete='CASCADE')

    class Meta:
        ordering = ['-created']
