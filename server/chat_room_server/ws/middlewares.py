import urllib.parse
import logging

from django.db import close_old_connections
from rest_framework.authtoken.models import Token

logger = logging.getLogger(__name__)


def get_token(query_string):
    for param in query_string.split('&'):
        key, value = param.split('=')
        if key == 'token':
            return value
    else:
        raise ValueError('"token" parameter does not exist')


class TokenAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner
        logger.warning(inner)

    def __call__(self, scope):
        try:
            query_string = urllib.parse.unquote(scope['query_string'].decode('utf-8'))
            if not query_string:
                raise ValueError('No query parameter provided')
            token = get_token(query_string)
            logger.warning('Token: {}'.format(token))

            close_old_connections()
            user = Token.objects.get(key=token).user
        except Exception as e:
            logger.warning('Token authentication failed: {}'.format(e))
            user = None

        return self.inner(dict(scope, user=user))
