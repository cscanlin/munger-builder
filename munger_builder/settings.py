"""
Django settings for munger_builder project.

Generated by 'django-admin startproject' using Django 1.8.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from django.contrib.messages import constants as messages
import dj_database_url

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_ID = 1

SECRET_KEY = os.getenv('MUNGER_BUILDER_SECRET')

MESSAGE_TAGS = {
    messages.SUCCESS: 'alert-success success',
    messages.WARNING: 'alert-warning warning',
    messages.INFO: 'alert-info info',
    messages.ERROR: 'alert-danger error',
}


# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = (
    # 'django.contrib.postgres',
    'djcelery',
    'django_admin_bootstrapped',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.sites',
    'crispy_forms',
    'bootstrap3',
    'kombu.transport.django',
    'smuggler',
    'guardian',
    'ordered_model',
    'rest_framework',
    'webpack_loader',
    'script_builder',
    'script_runner',
    'munger_builder',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.DjangoObjectPermissions',
    ),
    'PAGE_SIZE': 50
}

ROOT_URLCONF = 'munger_builder.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'munger_builder/templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.core.context_processors.static',
                'django.core.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'munger_builder.wsgi.application'

STATICFILES_FINDERS = (
    'compressor.finders.CompressorFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

DAB_FIELD_RENDERER = 'django_admin_bootstrapped.renderers.BootstrapFieldRenderer'

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Los_Angeles'

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOGIN_REDIRECT_URL = '/'
LOGIN_URL = 'django.contrib.auth.views.login'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

CRISPY_TEMPLATE_PACK = 'bootstrap3'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
MEDIA_URL = '/media/'

# We do this so that django's collectstatic copies or our bundles to the
# STATIC_ROOT or syncs them to whatever storage we use.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'assets'),
)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

# redis server address
# BROKER_URL = 'amqp://guest:guest@localhost:5672//'
# CELERY_RESULT_BACKEND = 'amqp://guest:guest@localhost:5672//'
BROKER_URL = 'django://'
CELERY_RESULT_BACKEND = 'djcelery.backends.database.DatabaseBackend'
# CELERY_IMPORTS = ('configurations.management')
# task result life time until they will be deleted
CELERY_TASK_RESULT_EXPIRES = 7*86400  # 7 days
CELERY_IGNORE_RESULT = False
# needed for worker monitoring
CELERY_SEND_EVENTS = True
# where to store periodic tasks (needed for scheduler)
CELERYBEAT_SCHEDULER = "djcelery.schedulers.DatabaseScheduler"

CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']

CELERY_SEND_TASK_ERROR_EMAILS = True

CELERYD_HIJACK_ROOT_LOGGER = False

# Name and email addresses of recipients
ADMINS = (
    ('Chris Scanlin', 'cscanlin@gmail.com'),
)

middleware_list = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'script_builder.current_user.RequestMiddleware'
]

SMUGGLER_EXCLUDE_LIST = [
    'contenttypes.contenttype',
    'sessions.session',
    'admin.logentry',
    'djcelery.taskmeta',
    'auth.permission',
    'kombu_transport_django.queue'
]

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
SERVER_EMAIL = os.getenv('EMAIL_HOST_USER')

DEFAULT_FROM_EMAIL = 'cscanlin@gmail.com'

MANAGERS = [
    ('Chris Scanlin', 'cscanlin@gmail.com'),
]

ANONYMOUS_USER_ID = -1
#
# GUARDIAN_GET_INIT_ANONYMOUS_USER = 'script_builder.models.get_anonymous_user_instance'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', # default
    'guardian.backends.ObjectPermissionBackend',
)

MIDDLEWARE_CLASSES = (
    middleware_list
)

if os.getenv('DJANGO_CONFIGURATION') == 'Prod':
    DEBUG = False
    DATABASES = {'default': dj_database_url.config()}
    # MIDDLEWARE_CLASSES = (
    #     ['sslify.middleware.SSLifyMiddleware'] + middleware_list
    # )
    # SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

else:
    DEBUG = True
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
    # MIDDLEWARE_CLASSES = (
    #     middleware_list
    # )

    STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'
