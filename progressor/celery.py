from __future__ import absolute_import

import os

from celery import Celery
from progressor.settings import base

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "progressor.settings.development")

app = Celery("progressor")

app.config_from_object("progressor.settings.development", namespace="CELERY"),

app.autodiscover_tasks(lambda: base.INSTALLED_APPS)