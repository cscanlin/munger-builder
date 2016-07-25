import os
import json
import datetime
import numpy as np

from django.core.exceptions import ValidationError
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponse

from guardian.shortcuts import assign_perm

from ordered_model.models import OrderedModel
from collections import OrderedDict

from .current_user import current_user

class PermissionedModel(object):

    def assign_perms(self, user):
        meta_name = self._meta.model_name
        permissions = (perm_name + meta_name for perm_name in ('add_', 'change_', 'delete_', 'view_'))
        for perm in permissions:
            assign_perm(perm, user, self)

class MungerBuilder(models.Model, PermissionedModel):

    class Meta:
        permissions = (
            ('view_mungerbuilder', 'View Munger'),
        )

    munger_name = models.CharField(max_length=200)

    munger_template = models.FilePathField(path='script_builder/templates/munger_templates', max_length=200,
                                           default='pandas_munger_template_basic.html')

    input_path = models.CharField(max_length=999, default='', blank=True)
    output_path = models.CharField(max_length=999, default='', blank=True)

    rows_to_delete_top = models.IntegerField(null=True, blank=True)
    rows_to_delete_bottom = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.assign_perms(current_user())

    def user_is_authorized(self):
        return current_user().has_perm('script_builder.change_mungerbuilder', self)

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
        return self.munger_name.replace(' ', '_').lower()

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

    @property
    def is_agg(self):
        if self.type_name not in ['index', 'column']:
            return True
        else:
            return False

    def __str__(self):
        return self.type_name.capitalize()

class DataField(models.Model, PermissionedModel):

    class Meta:
        permissions = (
            ('view_datafield', 'View Data Field'),
        )

    munger_builder = models.ForeignKey(MungerBuilder, related_name='data_fields', related_query_name='data_fields')
    current_name = models.CharField(max_length=200)
    new_name = models.CharField(max_length=200, null=True, blank=True)
    field_types = models.ManyToManyField(FieldType, blank=True, related_name='field_types',
                                         related_query_name='field_types')

    def save(self, *args, **kwargs):
        if not self.munger_builder.user_is_authorized():
            raise ValidationError(
                _('Not authorized to change munger: {}'.format(self.munger_builder.munger_name))
            )
        super().save(*args, **kwargs)
        self.assign_perms(current_user())

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

    @property
    def active_name(self):
        if self.new_name:
            return self.new_name
        else:
            return self.current_name

    @property
    def agg_types(self):
        return [ft.type_function for ft in self.field_types.all() if ft.type_name not in ['index', 'column']]

    def has_field_type(self, field_type_name):
        for field_type in self.field_types.all():
            if field_type.type_name == field_type_name:
                return True
        else:
            return False

    def __str__(self):
        return self.active_name


class CSVDocument(models.Model):
    csv_file = models.FileField(upload_to='csv-files')
