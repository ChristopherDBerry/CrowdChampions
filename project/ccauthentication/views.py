from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import AuthTokenSerializer


class CustomAuthToken(ObtainAuthToken):
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        super().post(request, *args, **kwargs)
        user = request.user  # Access the user from the request object
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
