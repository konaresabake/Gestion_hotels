from rest_framework import serializers

from .models import *


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "address",
            "email",
            "phone_number",
            "price_per_night",
            "currency",
            "photo",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    message = serializers.CharField(read_only=True)
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "verb", "message", "is_read", "created_at"]

    def get_is_read(self, obj):
        request = self.context.get("request")
        if not request:
            return False
        return obj.read_by.filter(pk=request.user.pk).exists()
