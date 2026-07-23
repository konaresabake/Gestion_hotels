from django.contrib import admin

from .models import *


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ("name", "address", "price_per_night", "currency", "owner")
    search_fields = ("name", "address")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("__str__", "actor", "verb", "created_at")
    list_filter = ("verb",)