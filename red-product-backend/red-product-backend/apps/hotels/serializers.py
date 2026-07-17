from rest_framework import serializers

from .models import Hotel


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
