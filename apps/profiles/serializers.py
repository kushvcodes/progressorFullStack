from django_countries.serializer_fields import CountryField
from rest_framework import fields, serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for retrieving user profile data"""
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")
    full_name = serializers.SerializerMethodField(read_only=True)
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "id",
            "profile_photo",
            "about_me",
            "gender",
            "country",
            "city",
            "is_student",
            "is_adhd",
            "rating",
        ]

    def get_full_name(self, obj):
        """Generate user's full name from first and last name"""
        first_name = obj.user.first_name.title()
        last_name = obj.user.last_name.title()
        return f"{first_name} {last_name}"


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile data"""
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "phone_number",
            "profile_photo",
            "about_me",
            "gender",
            "country",
            "city",
            "is_student",
            "is_adhd",
        ]
