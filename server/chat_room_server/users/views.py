from django.contrib.auth.models import User
from rest_framework import viewsets

from .serializers import UserSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
