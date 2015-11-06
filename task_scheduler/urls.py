from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^$', views.script_runner_index, name='script_runner_index'),
    url(r'^(?P<munger_builder_id>[0-9]+)/run_munger$', views.run_munger_output, name='run_munger_output'),
    url(r'^(?P<munger_builder_id>[0-9]+)/build_munger$', views.build_munger_output, name='build_munger_output'),
)
