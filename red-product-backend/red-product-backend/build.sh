#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

python manage.py shell <<EOF
from django.contrib.auth import get_user_model
import os

User = get_user_model()

email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
name = os.getenv("DJANGO_SUPERUSER_NAME")

if email and password and name:
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            name=name,
            password=password,
        )
        print("✅ Superutilisateur créé.")
    else:
        print("ℹ️ Le superutilisateur existe déjà.")
else:
    print("⚠️ Variables d'environnement manquantes.")
EOF