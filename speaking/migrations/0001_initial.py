# Generated by Django 5.0.2 on 2024-03-04 17:55

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200, unique=True, verbose_name='title')),
                ('part', models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', 'all parts')], default='1', max_length=20)),
            ],
            options={
                'ordering': ['topic'],
            },
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30, unique=True, verbose_name='name')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('finished_at', models.DateTimeField(auto_created=True, auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('part', models.CharField(choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', 'all parts')], default='1', max_length=20)),
                ('score', models.PositiveIntegerField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('questions', models.ManyToManyField(to='speaking.question')),
            ],
            options={
                'ordering': ['-finished_at'],
            },
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='speaking.answer')),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='topic',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='speaking.topic'),
        ),
    ]
