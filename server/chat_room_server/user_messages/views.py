from rest_framework import mixins
from rest_framework import generics

from .models import UserMessage
from .serializers import UserMessageSerializer


class UserMessageList(
        mixins.ListModelMixin,
        mixins.CreateModelMixin,
        generics.GenericAPIView):
    """
    List all user messages, or create a new user message
    """
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UserMessageDetail(
        mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin,
        mixins.DestroyModelMixin,
        generics.GenericAPIView):
    """
    Retrieve, update or delete a user message
    """
    queryset = UserMessage.objects.all()
    serializer_class = UserMessageSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
