from channels.routing import ProtocolTypeRouter, URLRouter

import ws.routing
from ws.middlewares import TokenAuthMiddleware


application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddleware(
        URLRouter(ws.routing.websocket_urlpatterns)
    ),
})
