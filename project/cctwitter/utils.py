from django.conf import settings
from celery.utils.log import get_task_logger
import tweepy

logger = get_task_logger(__name__)


def disable_managed_tweet(tweet, err=None, logger=logger):
    tweet.enabled = False
    tweet.save()
    if err and logger:
        logger.error(f'{tweet.name}')
        logger.error(f'{err}')


def send_tweet(tweet, logger=logger):
    if (tweet.expiry_times_sent and
        tweet.times_sent > tweet.expiry_times_sent): # noqa
        disable_managed_tweet(tweet)
        return
    if (tweet.expiry_date and
        tweet.expiry_date > timezone.now()): # noqa
        disable_managed_tweet(tweet)
        return
    data_lines = tweet.body_template_data
    if len(data_lines) == 0:
        body = tweet.body
    else:
        if len(data_lines) == 1:
            data = data_lines[0]
        else:
            try:
                data = data_lines[tweet.times_sent]
            except IndexError:
                disable_managed_tweet(
                    tweet, f'IndexError: {tweet.times_sent}')
                return
        try:
            body = f"{tweet.body}".format(**data)
        except KeyError as e:
            disable_managed_tweet(
                tweet, f'KeyError: {e}')
            return
    if settings.DEBUG:
        logger.info(body)
    else:  # TODO: send for real
        sender = tweet.owner
        if sender.access_key and sender.access_key_secret:
            client = tweepy.Client(
                consumer_key=settings.TWITTER_CONSUMER_KEY,
                consumer_secret=settings.TWITTER_CONSUMER_SECRET,
                access_token=sender.access_key,
                access_token_secret=sender.access_key_secret
            )
            client.create_tweet(text=body)
    #TODO: add logging
    tweet.times_sent += 1
    tweet.save()
