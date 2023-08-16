from django.urls import path
from .views import CCAuthToken

urlpatterns = [
    path('api/token/', CCAuthToken.as_view(), name='token_obtain_pair'),
]
