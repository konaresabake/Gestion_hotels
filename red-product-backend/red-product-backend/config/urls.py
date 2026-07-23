from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

from apps.hotels.urls import notification_urlpatterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.users.urls")),
    path("api/hotels/", include("apps.hotels.urls")),
    path("api/notifications/", include(notification_urlpatterns)),
]

# On sert /media/ dans tous les cas (dev ET prod).
# NB : le helper `static()` de Django ignore silencieusement cette route si
# DEBUG=False (même en dehors d'un `if settings.DEBUG`) — on utilise donc la
# vue `serve` directement pour contourner ce comportement.
# Ce n'est pas la solution la plus scalable pour un vrai projet à grande
# échelle (on utiliserait un stockage cloud comme S3/Cloudinary), mais ça
# suffit ici — attention, le disque Render est éphémère : les photos
# disparaissent à chaque redéploiement.
urlpatterns += [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
