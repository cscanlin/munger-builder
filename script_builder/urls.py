from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from . import api_views
from . import views

urlpatterns = patterns(
    '',
    url(r'^munger_builder_index/', views.munger_builder_index, name='munger_builder_index'),
    url(r'^new_munger_builder/', views.new_munger_builder, name='new_munger_builder'),
    url(r'^pivot_builder/(?P<munger_builder_id>[0-9]+)$', views.pivot_builder, name='pivot_builder'),
    url(r'^download_test_data/(?P<munger_builder_id>[0-9]+)$', views.download_test_data, name='download_test_data'),
    url(r'^poll_for_download/', views.poll_for_download, name='poll_for_download'),
    url(r'^mungers/$', api_views.Mungers.as_view(), name='mungerbuilder-list'),
    url(r'^mungers/(?P<pk>[0-9]+)$', api_views.Mungers.as_view(), name='mungerbuilder-detail'),
    url(r'^data_fields/$', api_views.DataFields.as_view(), name='datafield-list'),
    url(r'^data_fields/(?P<pk>[0-9]+)$', api_views.DataFields.as_view(), name='datafield-detail'),
    url(r'^pivot_fields/$', api_views.PivotFields.as_view(), name='pivotfield-list'),
    url(r'^pivot_fields/(?P<pk>[0-9]+)$', api_views.PivotFields.as_view(), name='pivotfield-detail'),
    url(r'^field_types/$', api_views.FieldTypes.as_view(), name='fieldtype-list'),
    url(r'^field_types/(?P<pk>[0-9]+)$', api_views.FieldTypes.as_view(), name='fieldtype-detail'),
    url(r'^', views.munger_builder_index, name='default'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
