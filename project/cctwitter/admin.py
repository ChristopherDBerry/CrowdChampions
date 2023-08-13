from django.contrib import admin

from .models import ManagedTweet

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

admin.site.register(ManagedTweet)