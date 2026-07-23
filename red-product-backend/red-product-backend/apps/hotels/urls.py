from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    HotelViewSet,
    NotificationListView,
    NotificationMarkAllReadView,
    NotificationUnreadCountView,
)

router = DefaultRouter()
router.register("", HotelViewSet, basename="hotel")

urlpatterns = router.urls

notification_urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("unread-count/", NotificationUnreadCountView.as_view(), name="notification-unread-count"),
    path("mark-all-read/", NotificationMarkAllReadView.as_view(), name="notification-mark-all-read"),
]
