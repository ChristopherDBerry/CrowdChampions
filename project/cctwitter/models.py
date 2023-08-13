from django.db import models
from django_celery_beat.models import (IntervalSchedule,
                                       CrontabSchedule)


class ManagedTweet(models.Model):
    body = models.CharField(max_length=4000)
    interval_schedule = models.ForeignKey(
        IntervalSchedule,
        on_delete=models.SET_NULL,   # Set to NULL on delete
        related_name='your_model_intervals',
        blank=True,                   # Allow the field to be blank
        null=True,                    # Allow NULL values
    )
    crontab_schedule = models.ForeignKey(
        CrontabSchedule,
        on_delete=models.SET_NULL,   # Set to NULL on delete
        related_name='your_model_crontabs',
        blank=True,                   # Allow the field to be blank
        null=True,                    # Allow NULL values
    )