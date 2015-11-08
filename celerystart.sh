#!/usr/bin/env bash

python manage.py celery worker --concurrency=1 &
python manage.py celery beat &
python manage.py celerycam --frequency=10.0 &
python manage.py runserver &
