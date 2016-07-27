from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from . import api_views
from . import views

urlpatterns = patterns(
    '',
    url(r'^munger_builder_index/', views.munger_builder_index, name='munger_builder_index'),
    url(r'^munger_builder_setup/$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_builder_setup/(?P<munger_builder_id>[0-9]+)$', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^munger_tools/(?P<munger_builder_id>[0-9]+)$', views.munger_tools, name='munger_tools'),
    url(r'^pivot_builder/(?P<munger_builder_id>[0-9]+)$', views.pivot_builder, name='pivot_builder'),
    url(r'^download_munger/(?P<munger_builder_id>[0-9]+)$', views.download_munger, name='download_munger'),
    url(r'^download_test_data/(?P<munger_builder_id>[0-9]+)$', views.download_test_data, name='download_test_data'),
    url(r'^poll_for_download/', views.poll_for_download, name='poll_for_download'),
    url(r'^munger/(?P<pk>[0-9]+)$', api_views.Mungers.as_view(), name='mungerbuilder-detail'),
    url(r'^munger/create$', api_views.Mungers.as_view(), name='mungerbuilder-create'),
    url(r'^munger/list$', api_views.Mungers.as_view(), name='mungerbuilder-list'),
    url(r'^data_field/(?P<pk>[0-9]+)$', api_views.DataFields.as_view(), name='datafield-detail'),
    url(r'^data_field/create$', api_views.DataFields.as_view(), name='datafield-create'),
    url(r'^data_field/list$', api_views.DataFields.as_view(), name='datafield-list'),
    url(r'^pivot_field/(?P<pk>[0-9]+)$', api_views.PivotFields.as_view(), name='pivotfield-detail'),
    url(r'^pivot_field/create$', api_views.PivotFields.as_view(), name='pivotfield-create'),
    url(r'^pivot_field/list$', api_views.PivotFields.as_view(), name='pivotfield-list'),
    url(r'^field_type/(?P<pk>[0-9]+)$', api_views.FieldTypes.as_view(), name='fieldtype-detail'),
    url(r'^field_type/create$', api_views.FieldTypes.as_view(), name='fieldtype-create'),
    url(r'^field_type/list$', api_views.FieldTypes.as_view(), name='fieldtype-list'),
    url(r'^', views.munger_builder_index, name='default'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
