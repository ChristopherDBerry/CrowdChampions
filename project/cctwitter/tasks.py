from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone

from django_celery_beat.models import PeriodicTask

from .models import ManagedTweet
from .utils import disable_managed_tweet, send_tweet

logger = get_task_logger(__name__)


@shared_task
def send_tweets(periodic_task_id):
    task = PeriodicTask.objects.get(id=periodic_task_id)
    tweets = ManagedTweet.objects.filter(enabled=True)
    if task.interval:
        tweets = tweets.filter(interval_schedule=task.interval)
    elif task.crontab:
        tweets = tweets.filter(crontab_schedule=task.crontab)
    # TODO: implement for clocked, solar
    for tweet in tweets:
        send_tweet(tweet)
