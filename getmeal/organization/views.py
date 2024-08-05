from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import OrganizationSerializer
from .models import Organizations
# Create your views here.

class OrganizationRegistrationView(APIView):
    permission_classes = [IsAuthenticated, ]
    @extend_schema(request=inline_serializer(
        name="InlineFormSerializer",
        fields={
            "name": serializers.CharField(),
            "address": serializers.CharField(),
            "image": serializers.ImageField(),
        },
    ), responses=OrganizationSerializer)

    def post(self, request):
        serializer = OrganizationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        Organizations.objects.create(
            user=request.user, 
            name=serializer.validated_data["name"], 
            address=serializer.validated_data["address"], 
            image=serializer.validated_data["image"]
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


        