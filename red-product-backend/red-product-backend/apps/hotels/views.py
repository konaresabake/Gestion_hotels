from django.db.models import Q
from rest_framework import generics, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Hotel, Notification
from .serializers import HotelSerializer, NotificationSerializer


class HotelViewSet(viewsets.ModelViewSet):
    """
    /api/hotels/          GET (liste, avec recherche/filtres) / POST (créer)
    /api/hotels/{id}/     GET / PUT / PATCH / DELETE

    Catalogue partagé : tous les admins voient et gèrent les mêmes hôtels.

    Paramètres de requête pour GET /api/hotels/ :
      - search       : recherche texte sur le nom ou l'adresse
      - min_price    : prix par nuit minimum
      - max_price    : prix par nuit maximum
      - currency     : devise exacte (XOF, EUR, USD)
      - ordering     : "price_per_night", "-price_per_night", "name", "-name",
                       "created_at", "-created_at" (défaut : -created_at)
    """

    serializer_class = HotelSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    ORDERING_FIELDS = {"price_per_night", "-price_per_night", "name", "-name", "created_at", "-created_at"}

    def get_queryset(self):
        queryset = Hotel.objects.select_related("owner").all()
        params = self.request.query_params

        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(address__icontains=search))

        min_price = params.get("min_price")
        if min_price:
            queryset = queryset.filter(price_per_night__gte=min_price)

        max_price = params.get("max_price")
        if max_price:
            queryset = queryset.filter(price_per_night__lte=max_price)

        currency = params.get("currency")
        if currency:
            queryset = queryset.filter(currency=currency)

        ordering = params.get("ordering")
        if ordering in self.ORDERING_FIELDS:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        Notification.objects.create(
            actor=self.request.user,
            verb=Notification.Verb.CREATED,
            hotel=instance,
            hotel_name=instance.name,
        )

    def perform_update(self, serializer):
        old = serializer.instance
        validated = serializer.validated_data

        changed_labels = []
        if "price_per_night" in validated and validated["price_per_night"] != old.price_per_night:
            changed_labels.append("le prix")
        if "name" in validated and validated["name"] != old.name:
            changed_labels.append("le nom")
        if "address" in validated and validated["address"] != old.address:
            changed_labels.append("l'adresse")
        if "photo" in validated:
            changed_labels.append("la photo")

        instance = serializer.save()
        Notification.objects.create(
            actor=self.request.user,
            verb=Notification.Verb.UPDATED,
            hotel=instance,
            hotel_name=instance.name,
            detail=" et ".join(changed_labels),
        )

    def perform_destroy(self, instance):
        Notification.objects.create(
            actor=self.request.user,
            verb=Notification.Verb.DELETED,
            hotel=None,
            hotel_name=instance.name,
        )
        instance.delete()


class NotificationListView(generics.ListAPIView):
    """GET /api/notifications/ — actions des AUTRES admins, plus récentes d'abord."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.exclude(actor=self.request.user).select_related("actor")[:50]

    def get_serializer_context(self):
        return {"request": self.request}


class NotificationUnreadCountView(APIView):
    """GET /api/notifications/unread-count/ — nombre de notifications non lues."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = (
            Notification.objects.exclude(actor=request.user)
            .exclude(read_by=request.user)
            .count()
        )
        return Response({"count": count})


class NotificationMarkAllReadView(APIView):
    """POST /api/notifications/mark-all-read/ — marque tout comme lu pour l'admin connecté."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notifications = Notification.objects.exclude(actor=request.user)
        for notification in notifications:
            notification.read_by.add(request.user)
        return Response({"detail": "Notifications marquées comme lues."})
