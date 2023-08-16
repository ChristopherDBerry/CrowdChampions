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
        if (tweet.expiry_times_sent and
            tweet.times_sent > tweet.expiry_times_sent): # noqa
            disable_managed_tweet(tweet)
            continue
        if (tweet.expiry_date and
            tweet.expiry_date > timezone.now()): # noqa
            disable_managed_tweet(tweet)
            continue
        data_lines = tweet.body_template_data
        if len(data_lines) == 1:
            data = data_lines[0]
        else:
            try:
                data = data_lines[tweet.times_sent]
            except IndexError:
                disable_managed_tweet(
                    tweet, f'IndexError: {tweet.times_sent}')
                continue
        try:
            body = f"{tweet.body}".format(**data)
        except KeyError as e:
            disable_managed_tweet(
                tweet, f'KeyError: {e}')
            continue
        # TODO: tweet, or log if debug
        send_tweet(tweet, body)
