import os
import json
import datetime
import numpy as np
from django.db import models

from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _

from ordered_model.models import OrderedModel
from collections import OrderedDict

class MungerBuilder(models.Model):

    munger_name = models.CharField(max_length=200)

    input_path = models.CharField(max_length=999, default='', blank=True)
    output_path = models.CharField(max_length=999, default='', blank=True)

    rows_to_delete_top = models.IntegerField(null=True, blank=True)
    rows_to_delete_bottom = models.IntegerField(null=True, blank=True)

    @property
    def index_fields(self):
        return [field.active_name for field in self.data_fields.all() if field.has_field_type('index')]

    @property
    def column_fields(self):
        return [field.active_name for field in self.data_fields.all() if field.has_field_type('column')]

    def agg_fields(self, evaled=False):
        if evaled:
            func = eval
        else:
            func = str
        return OrderedDict([(field.active_name, func(', '.join(field.agg_types))) for field in self.data_fields.all() if field.agg_types])

    @property
    def rename_field_dict(self):
        return OrderedDict([(field.current_name, field.new_name) for field in self.data_fields.all() if field.new_name and field.new_name != field.current_name])

    @property
    def safe_file_name(self):
        return self.munger_name.replace(' ','_').lower()

    @property
    def get_output_path(self):
        if not self.output_path:
            input_dir = os.path.dirname(self.input_path)
            return os.path.join(input_dir, '{0}-output.csv'.format(self.safe_file_name))

    def __str__(self):
        return self.munger_name

class FieldType(models.Model):
    type_name = models.CharField(max_length=200)
    type_function = models.CharField(max_length=200)

    def __str__(self):
        return self.type_name.capitalize()

class DataField(OrderedModel):

    class Meta(OrderedModel.Meta):
        pass

    munger_builder = models.ForeignKey(MungerBuilder, related_name='data_fields', related_query_name='data_fields')
    current_name = models.CharField(max_length=200)
    new_name = models.CharField(max_length=200, null=True, blank=True)
    field_types = models.ManyToManyField(FieldType, blank=True, related_name='field_types', related_query_name='field_types')

    @property
    def active_name(self):
        if self.new_name:
            return self.new_name
        else:
            return self.current_name

    @property
    def agg_types(self):
        return [ft.type_function for ft in self.field_types.all() if ft.type_name not in ['index','column']]

    def has_field_type(self, field_type_name):
        for field_type in self.field_types.all():
            if field_type.type_name == field_type_name:
                return True
        else:
            return False

    def __str__(self):
        return self.active_name


    #path to list
    # if not contains . then append csv
    # get agg func

class CSVDocument(models.Model):
    csv_file = models.FileField(upload_to='csv-files')
