from django.urls import path
from .views import CustomAuthToken

urlpatterns = [
    path('api/token/', CustomAuthToken.as_view(), name='token_obtain_pair'),
]
