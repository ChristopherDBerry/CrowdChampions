"""
Serializers for the cctwitter app.
"""

from rest_framework import serializers

from .models import Client, ManagedTweet, TweetTemplate


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'username']
