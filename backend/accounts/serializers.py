from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
    
def create(self, validated_data):
    email = validated_data.get('email', '')
    user = CustomUser.objects.create_user(
        username=validated_data['username'],
        password=validated_data['password'],
        email=email
    )
    return user
