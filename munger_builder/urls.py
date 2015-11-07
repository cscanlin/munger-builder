"""munger_builder URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url, patterns
from django.contrib import admin
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.home_page, name='home_page'),
    url(r'^app_index/$', views.app_index, name='app_index'),
    url(r'^admin/', include('smuggler.urls')),  # before admin url patterns!
    url(r'^admin/', include(admin.site.urls)),
    url(r'^script_builder/', include('script_builder.urls')),
    url(r'^script_runner_index/', include('script_runner.urls')),
    url(r'^register/$', views.register, name='register'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
    url('^', include('django.contrib.auth.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT,
    }),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.STATIC_ROOT,
    }),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
