# users/forms.py
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class CustomUserCreationForm(UserCreationForm):
    """Form for creating new users with custom fields"""
    class Meta(UserCreationForm):
        model = User
        fields = ["email", "username", "first_name", "last_name"]
        error_class = "error"


class CustomUserChangeForm(UserChangeForm):
    """Form for updating users with custom fields"""
    class Meta:
        model = User
        fields = ["email", "username", "first_name", "last_name"]
        error_class = "error"
