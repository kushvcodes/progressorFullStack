# users/serializers.py
from django.contrib.auth import get_user_model
from django_countries.serializer_fields import CountryField
from djoser.serializers import UserCreateSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data including profile information"""
    gender = serializers.CharField(source="profile.gender")
    profile_photo = serializers.ImageField(source="profile.profile_photo")
    country = CountryField(source="profile.country")
    city = serializers.CharField(source="profile.city")
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "gender",
            "profile_photo",
            "country",
            "city",
        ]

    def get_first_name(self, obj):
        """Return capitalized first name"""
        return obj.first_name.title()

    def get_last_name(self, obj):
        """Return capitalized last name"""
        return obj.last_name.title()

    def to_representation(self, instance):
        """Add admin flag for superusers"""
        representation = super(UserSerializer, self).to_representation(instance)
        if instance.is_superuser:
            representation["admin"] = True
        return representation


class CreateUserSerializer(UserCreateSerializer):
    """Serializer for creating new users"""
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
