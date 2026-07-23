"""
Envoi d'emails transactionnels (mot de passe oublié).

Priorité :
1. Brevo (API HTTP) — si BREVO_API_KEY est renseignée. Fonctionne partout,
   y compris sur Render gratuit où les ports SMTP sortants sont bloqués.
2. SMTP classique (Gmail...) — repli pratique pour le développement local.
3. Backend console Django — si aucune des deux configs n'est fournie.
"""

import logging

import requests
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def send_password_reset_email(admin, reset_link):
    """Envoie l'email de réinitialisation à `admin`, via Brevo si configuré, sinon SMTP/console."""

    subject = "RED Product — Réinitialisation du mot de passe"
    text_body = (
        f"Bonjour {admin.name},\n\n"
        "Vous avez demandé la réinitialisation de votre mot de passe RED Product.\n"
        f"Cliquez sur ce lien pour en choisir un nouveau : {reset_link}\n\n"
        "Ce lien expire après usage. Si vous n'êtes pas à l'origine de cette demande, "
        "ignorez simplement cet email."
    )
    html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <p>Bonjour {admin.name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe
             <strong>RED Product</strong>.</p>
          <p style="text-align:center; margin: 28px 0;">
            <a href="{reset_link}"
               style="background:#3d3d3d; color:#fff; padding:12px 24px;
                      border-radius:4px; text-decoration:none; display:inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p style="color:#8b8b93; font-size:13px;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
          </p>
        </div>
    """

    if settings.BREVO_API_KEY:
        _send_via_brevo(admin.email, admin.name, subject, html_body, text_body)
    else:
        _send_via_django(admin.email, subject, html_body, text_body)


def _send_via_brevo(to_email, to_name, subject, html_body, text_body):
    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL, "name": "RED Product"},
        "to": [{"email": to_email, "name": to_name}],
        "subject": subject,
        "htmlContent": html_body,
        "textContent": text_body,
    }
    headers = {
        "api-key": settings.BREVO_API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json",
    }

    response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)

    if response.status_code >= 400:
        logger.error("Échec envoi Brevo (%s): %s", response.status_code, response.text)
        raise RuntimeError(f"Brevo a refusé l'envoi : {response.status_code} — {response.text}")


def _send_via_django(to_email, subject, html_body, text_body):
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)