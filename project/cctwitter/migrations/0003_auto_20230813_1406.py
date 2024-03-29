# Generated by Django 3.2.4 on 2023-08-13 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cctwitter', '0002_auto_20230813_1246'),
    ]

    operations = [
        migrations.AddField(
            model_name='tweettemplate',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='managedtweet',
            name='body',
            field=models.TextField(help_text='Body will be overriden by template if one is selected', max_length=4000),
        ),
        migrations.AlterField(
            model_name='tweettemplate',
            name='body',
            field=models.TextField(help_text='To display a variable use curly braces, eg {arg1}', max_length=4000),
        ),
    ]
