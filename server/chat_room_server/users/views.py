from django.contrib.auth.models import User
from rest_framework import generics

from .serializers import UserSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
