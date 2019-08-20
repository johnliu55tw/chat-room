from rest_framework import serializers
from .models import UserMessage


class UserMessageSerializer(serializers.HyperlinkedModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = UserMessage
        fields = ['id', 'content', 'created', 'sender', ]
