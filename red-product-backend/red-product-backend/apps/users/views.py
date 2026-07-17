from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Admin
from .serializers import (
    EmailTokenObtainPairSerializer,
    ForgotPasswordSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
)

token_generator = PasswordResetTokenGenerator()


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Inscription en tant qu'Admin."""

    queryset = Admin.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Connexion (email + mot de passe), renvoie access/refresh JWT."""

    serializer_class = EmailTokenObtainPairSerializer


class ForgotPasswordView(APIView):
    """POST /api/auth/forgot-password/ — Envoie un email avec le lien de réinitialisation."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            admin = Admin.objects.get(email=email)
        except Admin.DoesNotExist:
            # On répond toujours 200 pour ne pas révéler si l'email existe
            return Response({"detail": "Si ce compte existe, un email a été envoyé."})

        uid = urlsafe_base64_encode(force_bytes(admin.pk))
        token = token_generator.make_token(admin)
        reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

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

        email = EmailMultiAlternatives(
            subject="RED Product — Réinitialisation du mot de passe",
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[admin.email],
        )
        email.attach_alternative(html_body, "text/html")
        email.send(fail_silently=False)

        return Response({"detail": "Si ce compte existe, un email a été envoyé."})


class ResetPasswordView(APIView):
    """POST /api/auth/reset-password/ — Applique le nouveau mot de passe via uid + token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            admin_id = force_str(urlsafe_base64_decode(uid))
            admin = Admin.objects.get(pk=admin_id)
        except (Admin.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Lien invalide."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(admin, token):
            return Response({"detail": "Lien invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)

        admin.set_password(new_password)
        admin.save()
        return Response({"detail": "Mot de passe mis à jour avec succès."})


class MeView(generics.RetrieveAPIView):
    """GET /api/auth/me/ — Infos de l'admin connecté (pour le header du dashboard)."""

    from .serializers import AdminSerializer

    serializer_class = AdminSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
