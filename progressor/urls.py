#progressor/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("supersecret/", admin.site.urls),
    path("api/v1/auth/", include("djoser.urls")),
    path("api/v1/auth/", include("djoser.urls.jwt")),
    path("api/v1/profile/", include("apps.profiles.urls")),
    path('', include('apps.chat.urls')),
]


admin.site.site_header = "ProgressorAI Admin"
admin.site.site_title = "ProgressorAI Admin Portal"
admin.site.index_title = "Welcome to the ProgressorAI Portal"