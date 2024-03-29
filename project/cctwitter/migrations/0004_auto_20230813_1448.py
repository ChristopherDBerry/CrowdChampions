# Generated by Django 3.2.4 on 2023-08-13 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cctwitter', '0003_auto_20230813_1406'),
    ]

    operations = [
        migrations.AddField(
            model_name='managedtweet',
            name='name',
            field=models.CharField(blank=True, default='Managed Tweet', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='managedtweet',
            name='body',
            field=models.TextField(blank=True, help_text='Body will be overriden by template if one is selected', max_length=4000, null=True),
        ),
        migrations.AlterField(
            model_name='tweettemplate',
            name='name',
            field=models.CharField(default='Managed Tweet', max_length=100),
            preserve_default=False,
        ),
    ]
