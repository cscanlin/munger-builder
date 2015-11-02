start python manage.py celery worker --concurrency=1
start python manage.py celery beat
start python manage.py celerycam --frequency=10.0
start python manage.py runserver
