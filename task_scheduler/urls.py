from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^$', views.script_runner_index, name='script_runner_index'),
    url(r'^munger_builder_index/', views.munger_builder_index, name='munger_builder_index'),
    url(r'^munger_builder_results/', views.munger_builder_results, name='munger_builder_results'),
    url(r'^(?P<munger_builder_id>[0-9]+)/run$', views.munger_builder_results, name='munger_builder_results'),
)
