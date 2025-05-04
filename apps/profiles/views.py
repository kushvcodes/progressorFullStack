from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .exceptions import NotYourProfile, ProfileNotFound
from .models import Profile
from .renderers import ProfileJSONRenderer
from .serializers import ProfileSerializer, UpdateProfileSerializer


class GetProfileAPIView(APIView):
    """
    API view to retrieve the current user's profile
    
    Attributes:
        permission_classes: Requires user authentication
        renderer_classes: Uses custom JSON renderer for profile data
    """
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    def get(self, request):
        """
        Get the authenticated user's profile
        
        Returns:
            Response: Serialized profile data with HTTP 200 status
        """
        user = self.request.user
        user_profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(user_profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateProfileAPIView(APIView):
    """
    API view to update a user profile
    
    Attributes:
        permission_classes: Requires user authentication
        renderer_classes: Uses custom JSON renderer for profile data
        serializer_class: Specifies serializer for profile updates
    """
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]
    serializer_class = UpdateProfileSerializer

    def patch(self, request, username):
        """
        Update profile if it belongs to the authenticated user
        
        Args:
            request: HTTP request object
            username: Username of profile to update
            
        Returns:
            Response: Serialized updated profile data with HTTP 200 status
            
        Raises:
            ProfileNotFound: If profile doesn't exist
            NotYourProfile: If user tries to update another user's profile
        """
        try:
            Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            raise ProfileNotFound

        user_name = request.user.username
        if user_name != username:
            raise NotYourProfile

        data = request.data
        serializer = UpdateProfileSerializer(
            instance=request.user.profile, data=data, partial=True
        )

        serializer.is_valid()
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
