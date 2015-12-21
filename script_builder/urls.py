from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^munger_builder_index/', views.munger_builder_index, name='munger_builder_index'),
    url(r'^munger_builder_setup/$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_builder_setup/(?P<munger_builder_id>[0-9]+)$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_tools/(?P<munger_builder_id>[0-9]+)$', views.munger_tools, name='munger_tools'),
    url(r'^field_parser/(?P<munger_builder_id>[0-9]+)$', views.field_parser, name='field_parser'),
    url(r'^field_parser/(?P<field_id>[0-9]+)/delete$', views.field_delete, name='field_delete'),
    url(r'^pivot_builder/(?P<munger_builder_id>[0-9]+)$', views.pivot_builder, name='pivot_builder'),
    url(r'^save_pivot_fields/(?P<munger_builder_id>[0-9]+)$', views.save_pivot_fields, name='save_pivot_fields'),
    url(r'^download_munger/(?P<munger_builder_id>[0-9]+)$', views.download_munger, name='download_munger'),
    url(r'^download_test_data/(?P<munger_builder_id>[0-9]+)$', views.download_test_data, name='download_test_data'),
    url(r'^poll_for_download/', views.poll_for_download, name='poll_for_download'),
    url(r'^', views.munger_builder_index, name='default'),
)
