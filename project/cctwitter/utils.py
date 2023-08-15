from django.conf import settings
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


def disable_managed_tweet(tweet, err=None, logger=logger):
    tweet.enabled = False
    tweet.save()
    if err and logger:
        logger.error(f'{tweet.name}')
        logger.error(f'{err}')


def send_tweet(tweet, body, logger=logger):
    if settings.DEBUG:
        logger.info(body)
    else:  # TODO: send for real
        logger.info(body)
    #TODO: add logging
    tweet.times_sent += 1
    tweet.save()
