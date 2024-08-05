from django.urls import path, include

from .views import OrganizationRegistrationView

urlpatterns = [
    path("registration/", OrganizationRegistrationView.as_view(), name="organization-registration")
] 