from django.contrib.auth.models import User
from django.db import models
from .utils import send_tweet
from django_celery_beat.models import (IntervalSchedule,
                                       CrontabSchedule)


class Client(models.Model):
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    username = models.CharField(max_length=100)
    authorization_url = models.CharField(max_length=200, blank=True, null=True)
    oauth_token = models.CharField(max_length=100, blank=True, null=True)
    oauth_token_secret = models.CharField(max_length=100, blank=True, null=True)
    access_key = models.CharField(max_length=100, blank=True, null=True)
    access_key_secret = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username


class ManagedTweet(models.Model):
    """ A managed tweet with a schedule """

    class Meta:
        verbose_name = "Managed Tweet"
        verbose_name_plural = "Managed Tweets"
        ordering = ['owner']

    enabled = models.BooleanField(default=True)
    name = models.CharField(max_length=100,)
    owner = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    body = models.TextField(
        null=True,
        blank=True,
        max_length=4000,
        help_text="To display a variable use curly braces, eg {arg1}")
    body_template_data = models.JSONField(
        default=list,
        blank=True,
        null=True,
        help_text='Data to be used in the template')
    times_sent = models.IntegerField(default=0)
    delay = models.IntegerField(
        default=None,
        blank=True,
        null=True,
        help_text="If there is no schedule, "
                  "delay sending this tweet by this many seconds")
    expiry_times_sent = models.IntegerField(
        default=None,
        blank=True,
        null=True,
        help_text="Number of times to send this tweet")
    expiry_date = models.DateTimeField(
        default=None,
        help_text="Date and time to stop sending this tweet",
        blank=True,
        null=True,
    )
    interval_schedule = models.ForeignKey(
        IntervalSchedule,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    crontab_schedule = models.ForeignKey(
        CrontabSchedule,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        send = False
        if not self.pk:
            send = True
        super(ManagedTweet, self).save(*args, **kwargs)
        if send:
            # Send tweet only for newly created instances without schedule
            if not self.interval_schedule and not self.crontab_schedule:
                send_tweet(self)