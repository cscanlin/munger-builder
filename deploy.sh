# git push origin master

git push heroku master
heroku run python manage.py migrate -a munger-builder

# To fully reset:
# heroku pg:reset DATABASE -a munger-builder --confirm munger-builder
# heroku run python manage.py migrate -a munger-builder
# heroku run python manage.py loaddata initial_data -a munger-builder
# heroku run python manage.py createsuperuser -a munger-builder
# (Enter Credentials)
# heroku restart -a app_name
