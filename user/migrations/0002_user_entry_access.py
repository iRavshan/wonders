# Generated by Django 5.0.2 on 2024-03-25 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='entry_access',
            field=models.BooleanField(default=False),
        ),
    ]
