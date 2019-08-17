from rest_framework import serializers
from .models import UserMessage


class UserMessageSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    content = serializers.CharField(required=True, allow_blank=True)
    created = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return UserMessage.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)

        instance.save()
        return instance
