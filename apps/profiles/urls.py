from django.urls import path

from .views import GetProfileAPIView, UpdateProfileAPIView

urlpatterns = [
    # Get current user's profile
    path("me/", GetProfileAPIView.as_view(), name="get_profile"),
    # Update profile by username
    path(
        "update/<str:username>/", UpdateProfileAPIView.as_view(), name="update_profile"
    ),
]
