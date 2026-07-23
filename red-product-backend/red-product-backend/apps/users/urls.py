from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminCountView,
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    MeView,
    RegisterView,
    ResetPasswordView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("count/", AdminCountView.as_view(), name="admin-count"),
]
