from rest_framework import generics
from rest_framework import permissions

from .models import UserMessage
from .serializers import UserMessageSerializer
from .permissions import IsOwnerOrReadOnly


class UserMessageList(generics.ListCreateAPIView):
    """
    List all user messages, or create a new user message
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class UserMessageDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a user message
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer
