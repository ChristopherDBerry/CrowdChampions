# Generated by Django 3.2.4 on 2023-08-13 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cctwitter', '0004_auto_20230813_1448'),
    ]

    operations = [
        migrations.AlterField(
            model_name='managedtweet',
            name='name',
            field=models.CharField(default='Managed tweet', max_length=100),
            preserve_default=False,
        ),
    ]
