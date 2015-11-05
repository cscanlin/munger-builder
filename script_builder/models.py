import requests
import json
import datetime
import numpy as np
from django.db import models

from django.shortcuts import get_object_or_404
from djcelery.models import CrontabSchedule, PeriodicTask
from django.utils.translation import ugettext_lazy as _

class MungerBuilder(models.Model):

    munger_name = models.CharField(max_length=200)

    input_folder = models.CharField(max_length=999, null=True, blank=True)
    input_filename = models.CharField(max_length=200, null=True, blank=True)

    output_folder = models.CharField(max_length=999, null=True, blank=True)
    output_filename = models.CharField(max_length=200, null=True, blank=True)

    rows_to_delete_top = models.IntegerField(null=True, blank=True)
    rows_to_delete_bottom = models.IntegerField(null=True, blank=True)

    def included_fields(self):
        return self.data_fields.all().filter(include_field=True)

    def fields_to_rename(self):
        data_fields = self.included_fields()
        return {field.current_name: field.new_name for field in data_fields.filter(new_name__isnull=False)}

    def index_fields(self):
        data_fields = self.included_fields()
        return [field.current_name for field in data_fields.filter(is_index=True)]

    def agg_fields(self):
        data_fields = self.included_fields()
        return {field.current_name: field.aggfunc() for field in data_fields.filter(aggregate_type__isnull=False)}

    def __unicode__(self):
        return str(self.munger_name)

class FieldType(models.Model):
    type_name = models.CharField(max_length=200)

    def type_func(self):
        func_dict = {
            'index': 'index',
            'count': len,
            'sum': np.sum,
            'mean': np.mean,
            'median': np.median,
        }
        return func_dict[self.type_name]

    def __unicode__(self):
        return str(self.type_name).capitalize()

class DataField(models.Model):

    munger_builder = models.ForeignKey(MungerBuilder, related_name='data_fields', related_query_name='data_fields')
    current_name = models.CharField(max_length=200)
    new_name = models.CharField(max_length=200, null=True, blank=True)
    field_types = models.ManyToManyField(FieldType, blank=True)

    def __unicode__(self):
        if self.new_name:
            return str(self.new_name)
        else:
            return str(self.current_name)

    def active_name(self):
        if self.new_name:
            return self.new_name
        else:
            return self.current_name

    #path to list
    # if not contains . then append csv
    # get agg func

class CSVDocument(models.Model):
    csv_file = models.FileField(upload_to='csv-files/%Y-%m')
