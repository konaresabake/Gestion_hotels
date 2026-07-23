from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Admin


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = Admin
        fields = ["id", "name", "email", "password", "accepted_terms"]

    def validate_accepted_terms(self, value):
        if not value:
            raise serializers.ValidationError("Vous devez accepter les termes et la politique.")
        return value

    def create(self, validated_data):
        return Admin.objects.create_user(**validated_data)


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ["id", "name", "email", "avatar", "created_at"]


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Utilisé par PATCH /api/auth/me/ — un admin modifie son propre profil."""

    class Meta:
        model = Admin
        fields = ["name", "email", "avatar"]

    def validate_email(self, value):
        qs = Admin.objects.exclude(pk=self.instance.pk).filter(email=value)
        if qs.exists():
            raise serializers.ValidationError("Cet email est déjà utilisé par un autre compte.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Mot de passe actuel incorrect.")
        return value


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login avec email + mot de passe (le champ USERNAME_FIELD est déjà 'email')."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["admin"] = AdminSerializer(self.user).data
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
