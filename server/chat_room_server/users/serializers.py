from django.contrib.auth.models import User
from rest_framework import serializers

from user_messages.models import UserMessage


class UserSerializer(serializers.HyperlinkedModelSerializer):
    messages = serializers.HyperlinkedRelatedField(
        view_name='user_message-detail',
        queryset=UserMessage.objects.all(),
        many=True)

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'messages']
        read_only_fields = ['username']
