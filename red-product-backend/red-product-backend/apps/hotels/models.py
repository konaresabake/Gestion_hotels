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



class Notification(models.Model):
    """
    Notification générée automatiquement quand un admin crée/modifie/supprime
    un hôtel — visible par tous les AUTRES admins (catalogue partagé).
    """

    class Verb(models.TextChoices):
        CREATED = "created", "a ajouté"
        UPDATED = "updated", "a modifié"
        DELETED = "deleted", "a supprimé"

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications_sent"
    )
    verb = models.CharField(max_length=10, choices=Verb.choices)
    hotel = models.ForeignKey(
        Hotel, on_delete=models.SET_NULL, null=True, blank=True, related_name="notifications"
    )
    # Nom figé au moment de l'action : reste lisible même si l'hôtel est
    # supprimé ensuite (hotel devient alors NULL).
    hotel_name = models.CharField(max_length=200)
    # Détail optionnel pour une modification, ex. "le prix", "le nom"
    detail = models.CharField(max_length=255, blank=True)
    read_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="read_notifications", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.message()

    def message(self):
        actor_name = self.actor.name
        if self.verb == self.Verb.CREATED:
            return f"{actor_name} a ajouté l'hôtel {self.hotel_name}"
        if self.verb == self.Verb.DELETED:
            return f"{actor_name} a supprimé {self.hotel_name}"
        if self.detail:
            return f"{actor_name} a modifié {self.detail} de {self.hotel_name}"
        return f"{actor_name} a modifié l'hôtel {self.hotel_name}"

