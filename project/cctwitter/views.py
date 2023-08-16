import requests
from requests_oauthlib import OAuth1Session

from django.conf import settings
from rest_framework import (viewsets,
                            permissions,
                            status)
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Client, ManagedTweet
from .serializers import *


class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for twitter clients
    """
    queryset = Client.objects.all().order_by('-id')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetUserClients(APIView):
    """
    API endpoint for twitter clients
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientSerializer

    def get(self, request):
        clients = Client.objects.filter(owner=request.user)
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetClientTweets(APIView):
    """
    API endpoint for client tweets
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GetClientTweetsSerializer

    def get(self, request, client_id):
        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response({"error": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

        managed_tweets = ManagedTweet.objects.filter(owner=client)

        serializer = ManagedTweetSerializer(managed_tweets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GenerateClientUrl(APIView):
    """
    API endpoint for twitter client tokens
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GenerateClientUrlSerializer

    def get(self, request, client_id):
        oauth = OAuth1Session(
            settings.TWITTER_CONSUMER_KEY,
            client_secret=settings.TWITTER_CONSUMER_SECRET,
            callback_uri='oob')
        url = "https://api.twitter.com/oauth/request_token"

        try:
            response = oauth.fetch_request_token(url)
            resource_owner_oauth_token = response.get('oauth_token')
            resource_owner_oauth_token_secret = response.get(
                'oauth_token_secret')
        except requests.exceptions.RequestException:
            return Response({"error": "Something went wrong."}, status=500)
        authorization_url = (
            "https://api.twitter.com/oauth/authorize"
            f"?oauth_token={resource_owner_oauth_token}")

        client = Client.objects.get(id=client_id)
        client.authorization_url = authorization_url
        client.oauth_token = resource_owner_oauth_token
        client.oauth_token_secret = resource_owner_oauth_token_secret
        client.save()

        data = {"authorization_url": authorization_url,
                "resource_owner_oauth_token": resource_owner_oauth_token,
                "resource_owner_oauth_token_secret":
                    resource_owner_oauth_token_secret}
        return Response(data, status=status.HTTP_200_OK)


class GenerateClientToken(APIView):
    """
    API endpoint for twitter client tokens
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GenerateClientTokenSerializer

    def post(self, request):
        serializer = self.serializer_class
        serializer.is_valid(raise_exception=True)

        client_id = serializer.validated_data['client_id']
        pin = serializer.validated_data['pin']

        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response({"error": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

        oauth = OAuth1Session(
            settings.TWITTER_CONSUMER_KEY,
            client_secret=settings.TWITTER_CONSUMER_SECRET,
            resource_owner_key=client.oauth_token,
            resource_owner_secret=client.oauth_token_secret,
            verifier=pin)

        url = "https://api.twitter.com/oauth/access_token"

        try:
            response = oauth.fetch_access_token(url)
            access_key = response['oauth_token']
            access_key_secret = response['oauth_token_secret']
            user_id = response['user_id']
            screen_name = response['screen_name']
        except requests.exceptions.RequestException:
            return Response({"error": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        client.access_key = access_key
        client.access_key_secret = access_key_secret
        client.save()

        data = {'status': 'success', 'user_id': user_id, 'screen_name': screen_name}

        return Response(data, status=status.HTTP_200_OK)
