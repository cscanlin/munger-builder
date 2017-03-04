git push origin master
git push heroku master
heroku run python manage.py loaddata initial_data --app munger-builder
heroku run python manage.py migrate --app munger-builder
