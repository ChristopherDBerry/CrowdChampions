"""
Serializers for the cctwitter app.
"""

from rest_framework import serializers

from .models import Client, ManagedTweet


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'username', 'authorization_url', 'access_key']


class ManagedTweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagedTweet
        fields = '__all__'


class GenerateClientTokenSerializer(serializers.Serializer):
    client_id = serializers.IntegerField()
    pin = serializers.CharField()


class GenerateClientUrlSerializer(serializers.Serializer):
    client_id = serializers.IntegerField()


class GetClientTweetsSerializer(serializers.Serializer):
    client_id = serializers.IntegerField()
