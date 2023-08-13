from celery import shared_task
from celery.utils.log import get_task_logger
from django.core.management import call_command
from .models import ManagedTweet
from django_celery_beat.models import PeriodicTask

logger = get_task_logger(__name__)


@shared_task
def send_tweets(periodic_task_id):
    task = PeriodicTask.objects.get(id=periodic_task_id)
    if task.interval:
        tweets = ManagedTweet.objects.filter(interval_schedule=task.interval)
        schedule = task.interval
    elif task.crontab:
        tweets = ManagedTweet.objects.filter(crontab_schedule=task.crontab)
        schedule = task.crontab
    #TODO: implement for clocked, solar
    for tweet in tweets:
        logger.info(f'{tweet.body} : {schedule}')