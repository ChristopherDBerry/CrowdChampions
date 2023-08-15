import requests
from requests_oauthlib import OAuth1Session

from drf_spectacular.utils import extend_schema
from django.conf import settings
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint for twitter clients
    """
    queryset = Client.objects.all().order_by('-id')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]


class GenerateClientUrl(APIView):
    """
    API endpoint for twitter client tokens
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, client_id):
        #return Response(request.POST, status=200)
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
        return Response(data)


class GenerateClientToken(APIView):
    """
    API endpoint for twitter client tokens
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, client_id, pin):
        client = Client.objects.get(id=client_id)

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
            return Response({"error": "Something went wrong."}, status=500)

        client.access_key = access_key
        client.access_key_secret = access_key_secret
        client.save()

        data = {'status': 'success', 'user_id': user_id, 'screen_name': screen_name}

        return Response(data, status=200)

