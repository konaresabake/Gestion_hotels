from django.conf import settings
from django.db import models


class Hotel(models.Model):
    class Devise(models.TextChoices):
        XOF = "XOF", "F XOF"
        EUR = "EUR", "€ EUR"
        USD = "USD", "$ USD"

    name = models.CharField("Nom de l'hôtel", max_length=200)
    address = models.CharField("Adresse", max_length=255)
    email = models.EmailField("E-mail")
    phone_number = models.CharField("Numéro de téléphone", max_length=30)
    price_per_night = models.DecimalField("Prix par nuit", max_digits=12, decimal_places=2)
    currency = models.CharField("Devise", max_length=3, choices=Devise.choices, default=Devise.XOF)
    photo = models.ImageField("Photo", upload_to="hotels/", blank=True, null=True)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="hotels"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
