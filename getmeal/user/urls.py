from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from .views import *

app_name='users'
urlpatterns = [
    path("registration/", RegistrationView.as_view(), name='user-registration'),
    path("logout/", LogoutView.as_view(), name='user-logout'),
    path("", CurrentUserView.as_view(), name='user-profile'),

    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
] 