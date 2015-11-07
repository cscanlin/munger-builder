from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^$', views.script_runner_index, name='script_runner_index'),
    url(r'^run_munger/(?P<munger_builder_id>[0-9]+)$', views.run_munger_output, name='run_munger_output'),
    url(r'^build_munger/(?P<munger_builder_id>[0-9]+)$', views.build_munger_output, name='build_munger_output'),
)
