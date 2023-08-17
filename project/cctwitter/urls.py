from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"clients", views.ClientViewSet, basename="client")
router.register(
    r"interval-schedules", views.IntervalScheduleViewSet,
    basename="interval-schedule")
router.register(
    r"managed-tweets", views.ManagedTweetViewSet,
    basename="managed-tweet")

app_name = "cctwitter"

urlpatterns = [
    path('', include(router.urls)),
    path('get-client-tweets/<int:client_id>/',
          views.GetClientTweets.as_view()),
    path('get-user-clients/', views.GetUserClients.as_view()),
    path('get-client-url/<int:client_id>/',
        views.GenerateClientUrl.as_view()),
    path('set-client-token/',
        views.GenerateClientToken.as_view()),
]
