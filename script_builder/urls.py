from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = patterns('',
    url(r'^munger_builder_index/', views.munger_builder_index, name='munger_builder_index'),
    url(r'^munger_builder_setup/$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_builder_setup/(?P<munger_builder_id>[0-9]+)$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_tools/(?P<munger_builder_id>[0-9]+)$', views.munger_tools, name='munger_tools'),
    url(r'^munger_tools/(?P<munger_builder_id>[0-9]+)/delete$', views.delete_munger, name='delete_munger'),
    url(r'^field_parser/(?P<munger_builder_id>[0-9]+)$', views.field_parser, name='field_parser'),
    url(r'^field_parser/(?P<field_id>[0-9]+)/delete$', views.delete_pivot_field, name='delete_pivot_field'),
    url(r'^pivot_builder/(?P<munger_builder_id>[0-9]+)$', views.pivot_builder, name='pivot_builder'),
    url(r'^save_pivot_fields/(?P<munger_builder_id>[0-9]+)$', views.save_pivot_fields, name='save_pivot_fields'),
    url(r'^add_pivot_field/(?P<munger_builder_id>[0-9]+)$', views.add_pivot_field, name='add_pivot_field'),
    url(r'^download_munger/(?P<munger_builder_id>[0-9]+)$', views.download_munger, name='download_munger'),
    url(r'^download_test_data/(?P<munger_builder_id>[0-9]+)$', views.download_test_data, name='download_test_data'),
    url(r'^poll_for_download/', views.poll_for_download, name='poll_for_download'),
    url(r'^munger/(?P<munger_builder_id>[0-9]+)/fields$', views.MungerFieldList.as_view()),
    url(r'^field/(?P<pk>[0-9]+)$', views.MungerField.as_view()),
    url(r'^', views.munger_builder_index, name='default'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
