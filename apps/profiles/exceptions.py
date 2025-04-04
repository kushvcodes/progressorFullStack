from rest_framework.exceptions import APIException


class ProfileNotFound(APIException):
    """Exception raised when a profile is not found"""
    status_code = 404
    default_detail = "The requested profile does not exist"


class NotYourProfile(APIException):
    """Exception raised when a user tries to edit someone else's profile"""
    status_code = 403
    default_detail = "You can't edit a profile that doesn't belong to you"
