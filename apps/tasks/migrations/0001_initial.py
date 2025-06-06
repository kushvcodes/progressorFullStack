# Generated by Django 5.1.7 on 2025-03-24 20:57

import django.db.models.deletion
import django.utils.timezone
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
            name='Task',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='pending', max_length=20)),
                ('est_points', models.IntegerField(default=10)),
                ('est_time', models.IntegerField(default=30)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('start_date', models.DateTimeField(blank=True, null=True)),
                ('completed_date', models.DateTimeField(blank=True, null=True)),
                ('category', models.TextField(choices=[('e', 'emergency'), ('f', 'family'), ('h', 'home'), ('p', 'personal'), ('s', 'social'), ('w', 'work')])),
                ('priority', models.TextField(choices=[('vl', 'Very low.'), ('l', 'Low.'), ('n', 'Normal :)'), ('h', 'High!'), ('vh', 'Very High!!')], default='normal')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
