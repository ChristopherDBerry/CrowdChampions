# Generated by Django 3.2.5 on 2023-08-16 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cctwitter', '0013_alter_managedtweet_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='managedtweet',
            name='body_template',
        ),
        migrations.AlterField(
            model_name='managedtweet',
            name='body',
            field=models.TextField(blank=True, help_text='To display a variable use curly braces, eg {arg1}', max_length=4000, null=True),
        ),
        migrations.DeleteModel(
            name='TweetTemplate',
        ),
    ]
