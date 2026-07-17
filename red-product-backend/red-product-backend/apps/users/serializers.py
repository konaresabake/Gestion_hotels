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
        fields = ["id", "name", "email", "created_at"]


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
