from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .email_utils import send_password_reset_email
from .models import Admin
from .serializers import (
    AdminSerializer,
    ChangePasswordSerializer,
    EmailTokenObtainPairSerializer,
    ForgotPasswordSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UpdateProfileSerializer,
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

        send_password_reset_email(admin, reset_link)

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


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/auth/me/ — Infos de l'admin connecté (pour le header du dashboard).
    PATCH /api/auth/me/ — Modifie son propre profil (nom, email, avatar).
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return UpdateProfileSerializer
        return AdminSerializer


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ — change le mot de passe de l'admin connecté."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Mot de passe mis à jour avec succès."})


class AdminCountView(APIView):
    """GET /api/auth/count/ — Nombre total d'Admins inscrits (carte 'Utilisateurs' du dashboard)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"count": Admin.objects.count()})
