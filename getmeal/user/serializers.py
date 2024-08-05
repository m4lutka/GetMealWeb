from rest_framework import serializers
from django.contrib.auth import password_validation

from .models import User

class UserSerialiazer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('password', )


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'password',
        ]
        extra_kwargs = {'password': {'write_only': True}}
    

    def validate_password(self, value):
        password_validation.validate_password(value, self.instance)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']

        )
        return user


