"""
Serializers for the cctwitter app.
"""

from rest_framework import serializers

from django.contrib.auth.models import User
from django_celery_beat.models import IntervalSchedule

from .models import Client, ManagedTweet

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class IntervalScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntervalSchedule
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'owner', 'username',
                   'authorization_url', 'access_key']


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
