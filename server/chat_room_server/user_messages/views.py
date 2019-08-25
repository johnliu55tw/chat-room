import logging

from rest_framework import permissions
from rest_framework import viewsets

from chat_room_server import celery

from .models import UserMessage
from .serializers import UserMessageSerializer
from .permissions import IsOwnerOrReadOnly


class UserMessageViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`
    `update` and `destroy` actions.
    """
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
        celery.message_notify.delay(serializer.data)
