from django.contrib import admin

from .models import ManagedTweet, TweetTemplate

# Custom admin for django_celery_beat
from django_celery_beat.admin import (PeriodicTask,
                                      PeriodicTaskAdmin)


class CustomPeriodicTaskAdmin(PeriodicTaskAdmin):
    """ Set args field to be id of PeriodicTask, so the task """
    """ knows which interval is calling it """
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.args = f'["{obj.id}"]'
        obj.save()


admin.site.unregister(PeriodicTask)
admin.site.register(PeriodicTask, CustomPeriodicTaskAdmin)


# End custom admin for django_celery_beat

class ManagedTweetAdmin(admin.ModelAdmin):
    """ Custom admin for ManagedTweet """
    fieldsets = (
        ('Tweet fields', {
            'fields': (
                'enabled',
                'name',
                'owner',
                'body',
                'body_template',
                'body_template_data',
                'times_sent'),
        }),
        ('Schedule fields. Leave blank to send the tweet immediately', {
            'fields': ('delay',
                       'expiry_times_sent',
                       'expiry_date',
                       'interval_schedule',
                       'crontab_schedule'),
        }),
    )

admin.site.register(ManagedTweet, ManagedTweetAdmin)
admin.site.register(TweetTemplate)
