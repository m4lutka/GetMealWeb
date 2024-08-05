from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken 

from .serializers import RegistrationSerializer, UserSerialiazer
from .models import User
# Create your views here.

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request):
        serializer = UserSerialiazer(request.user)
        return Response(serializer.data)

class RegistrationView(CreateAPIView):
   queryset = User.objects.all()
   serializer_class = RegistrationSerializer

   permission_classes = [AllowAny]

class LogoutView(APIView):
    """
        Endpoint to logout a user and invalidate their JWT tokens.

        - POST /users/logout/: Logout a user and invalidate their JWT tokens.

        Parameters:
        - request: The HTTP request object containing the refresh token.

        Returns:
        - Response: HTTP response indicating the success or failure of the logout attempt.
        """
    permission_classes = [IsAuthenticated, ]
    @extend_schema(request=inline_serializer(
        name="InlineFormSerializer",
        fields={
            "refresh_token": serializers.CharField(),
        },
    ))
    def post(self, request):
        """
               Logout a user and invalidate their JWT tokens.

               Parameters:
               - request: The HTTP request object containing the refresh token.

               Returns:
               - Response: HTTP response indicating the success or failure of the logout attempt.
               """
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)