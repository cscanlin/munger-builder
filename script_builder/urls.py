from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^munger_builder_setup/', views.munger_builder_setup, name='munger_builder_setup'),
    url(r'^field_parser/(?P<munger_builder_id>[0-9]+)$', views.field_import, name='field_parser'),
    url(r'^pivot_builder/(?P<munger_builder_id>[0-9]+)$', views.pivot_builder, name='pivot_builder'),
    url(r'^save_pivot_fields/(?P<munger_builder_id>[0-9]+)$', views.save_pivot_fields, name='save_pivot_fields'),
)
