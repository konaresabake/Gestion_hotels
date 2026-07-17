# RED Product — Backend

API Django REST Framework pour l'application de gestion d'hôtels **RED Product**
(inscription/connexion Admin, mot de passe oublié, CRUD hôtels).

## Stack
- Django 5+ / Django REST Framework
- SimpleJWT (authentification par token)
- SQLite en local par défaut, PostgreSQL en un changement de variable d'env
- django-cors-headers (pour connecter le frontend React)

## Installation

```bash
python -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # puis ajuste les valeurs si besoin
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

L'API tourne sur `http://127.0.0.1:8000/`.

### Passer sur PostgreSQL
Dans `.env`, garde `DB_ENGINE=postgresql` et renseigne `DB_NAME`, `DB_USER`,
`DB_PASSWORD`, `DB_HOST`, `DB_PORT`. Supprime la ligne `DB_ENGINE` pour revenir
à SQLite.

## Endpoints

| Méthode | URL                              | Description                          | Auth requise |
|---------|-----------------------------------|---------------------------------------|:---:|
| POST    | `/api/auth/register/`            | Inscription Admin (nom, email, mdp)  | non |
| POST    | `/api/auth/login/`               | Connexion → `access` + `refresh` JWT | non |
| POST    | `/api/auth/login/refresh/`       | Renouvelle le token `access`         | non |
| POST    | `/api/auth/forgot-password/`     | Envoie l'email de réinitialisation   | non |
| POST    | `/api/auth/reset-password/`      | Applique le nouveau mot de passe     | non |
| GET     | `/api/auth/me/`                  | Infos de l'admin connecté            | oui |
| GET     | `/api/hotels/`                   | Liste des hôtels de l'admin connecté | oui |
| POST    | `/api/hotels/`                   | Créer un hôtel (multipart, avec photo)| oui |
| GET     | `/api/hotels/{id}/`              | Détail d'un hôtel                    | oui |
| PUT/PATCH | `/api/hotels/{id}/`            | Modifier un hôtel                    | oui |
| DELETE  | `/api/hotels/{id}/`              | Supprimer un hôtel                   | oui |

Pour les routes protégées, ajoute le header :
`Authorization: Bearer <access_token>`

## Exemple : créer un hôtel

```bash
curl -X POST http://127.0.0.1:8000/api/hotels/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "name=CAP Marniane" \
  -F "address=Les îles du saloum, Mar Lodj" \
  -F "email=information@gmail.com" \
  -F "phone_number=+221 77 777 77 77" \
  -F "price_per_night=25000" \
  -F "currency=XOF" \
  -F "photo=@/chemin/vers/photo.jpg"
```

## Envoi d'emails réels (mot de passe oublié) via Gmail

Par défaut, les emails s'affichent seulement dans le terminal (mode dev). Pour
un envoi réel via Gmail :

1. Active la validation en 2 étapes sur le compte Gmail qui enverra les emails
   (obligatoire pour générer un mot de passe d'application) :
   `https://myaccount.google.com/security`
2. Génère un **mot de passe d'application** :
   `https://myaccount.google.com/apppasswords` → choisis "Autre", nomme-le
   "RED Product", copie le mot de passe à 16 caractères généré.
3. Dans `.env`, renseigne :
   ```
   EMAIL_HOST_USER=ton-adresse@gmail.com
   EMAIL_HOST_PASSWORD=le-mot-de-passe-a-16-caracteres   # pas ton vrai mot de passe Gmail
   DEFAULT_FROM_EMAIL=ton-adresse@gmail.com
   FRONTEND_URL=http://localhost:5173                    # ou l'URL de prod du frontend
   ```
4. Relance `python manage.py runserver` — dès que ces deux variables sont
   présentes, l'app bascule automatiquement sur l'envoi SMTP réel.

**Limite Gmail** : ~500 emails/jour pour un compte gratuit. Suffisant en dev
et pour un petit volume ; au-delà, passe sur un service dédié (Brevo, SendGrid,
Mailgun...) — seules les variables `EMAIL_HOST*` changent, le code reste identique.

**Test rapide** : appelle `/api/auth/forgot-password/` avec l'email d'un admin
existant et vérifie sa boîte de réception (et ses spams, le premier envoi y
atterrit parfois).

## Admin Django
Accessible sur `/admin/` avec le compte créé via `createsuperuser` — pratique
pour visualiser/gérer les hôtels sans passer par le frontend pendant le dev.

## Prochaine étape
Ce backend est prêt à être consommé par le frontend React (endpoints + JWT +
CORS déjà configurés pour `localhost:5173` et `localhost:3000`).
