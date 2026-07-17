from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class AdminManager(BaseUserManager):
    """Manager custom : la connexion se fait par email, pas par username."""

    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra_fields)


class Admin(AbstractUser):
    """Utilisateur Admin de RED Product. On désactive `username` au profit de `email`."""

    username = None
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    accepted_terms = models.BooleanField(default=False)
    keep_logged_in = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = AdminManager()

    def __str__(self):
        return f"{self.name} <{self.email}>"
