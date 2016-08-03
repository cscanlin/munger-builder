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
from collections import OrderedDict, defaultdict

from .current_user import current_user

class PermissionedModel(object):

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.assign_perms(current_user())

    def assign_perms(self, user):
        meta_name = self._meta.model_name
        permissions = (perm_name + meta_name for perm_name in ('add_', 'change_', 'delete_', 'view_'))
        for perm in permissions:
            assign_perm(perm, user, self)

class FieldType(models.Model, PermissionedModel):

    class Meta:
        permissions = (
            ('view_fieldtype', 'View Pivot Field'),
        )

    type_name = models.CharField(max_length=200)
    type_function = models.CharField(max_length=200)

    @classmethod
    def default_field_types(cls):
        return cls.objects.filter(pk__in=range(1, 7))

    def __str__(self):
        return self.type_name.capitalize()

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

    rows_to_delete_top = models.IntegerField(default=0)
    rows_to_delete_bottom = models.IntegerField(default=0)

    field_types = models.ManyToManyField(FieldType, related_name='munger_builder', related_query_name='munger_builder')

    default_aggregate_field_type = models.ForeignKey(FieldType, default=3, limit_choices_to={'pk__gt': 2},)
    is_sample = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Always add default field types unless set from admin
        self.field_types.add(*(field_type for field_type in FieldType.default_field_types()))
        self.assign_perms(current_user())

    def user_is_authorized(self):
        return current_user().has_perm('script_builder.change_mungerbuilder', self)

    @property
    def pivot_fields(self):
        return PivotField.objects.filter(data_field__munger_builder__id=self.id)

    @property
    def index_fields(self):
        return [pf.active_name for pf in self.pivot_fields.filter(field_type__id=1)]

    @property
    def column_fields(self):
        return [pf.active_name for pf in self.pivot_fields.filter(field_type__id=2)]

    def aggregate_names_with_functions(self, evaled=False):
        # Needs to be ordered dicts
        func = eval if evaled else str
        aggregates_dict = defaultdict(list)
        for pf in self.pivot_fields.filter(field_type__id__gt=2):
            aggregates_dict[pf.active_name].append(pf.type_function)
        return {name: func(', '.join(type_functions)) for name, type_functions in aggregates_dict.items()}

    @property
    def rename_field_dict(self):
        return {field.current_name: field.new_name for field in self.data_fields.all() if field.needs_rename}

    @property
    def safe_file_name(self):
        return self.munger_name.replace(' ', '_').lower()

    @property
    def get_output_path(self):
        if self.output_path:
            return self.output_path
        else:
            input_dir = os.path.dirname(self.input_path)
            return os.path.join(input_dir, '{0}-output.csv'.format(self.safe_file_name))

    def __str__(self):
        return self.munger_name

class DataField(models.Model, PermissionedModel):

    class Meta:
        permissions = (
            ('view_datafield', 'View Data Field'),
        )

    munger_builder = models.ForeignKey(MungerBuilder, related_name='data_fields', related_query_name='data_fields')
    current_name = models.CharField(max_length=200)
    new_name = models.CharField(max_length=200, null=True, blank=True)

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
    def needs_rename(self):
        return self.new_name and self.new_name != self.current_name

    @property
    def active_name(self):
        if self.new_name:
            return self.new_name
        else:
            return self.current_name

    def __str__(self):
        return self.active_name

class PivotField(OrderedModel, PermissionedModel):

    class Meta:
        permissions = (
            ('view_pivotfield', 'View Pivot Field'),
        )

    # should be ordered
    data_field = models.ForeignKey(DataField, related_name='pivot_fields', related_query_name='pivot_fields')
    field_type = models.ForeignKey(FieldType, related_name='pivot_fields', related_query_name='pivot_fields')

    def save(self, *args, **kwargs):
        if not self.data_field.munger_builder.user_is_authorized():
            raise ValidationError(
                _('Not authorized to change munger: {}'.format(self.data_field.munger_builder.munger_name))
            )
        super().save(*args, **kwargs)
        self.assign_perms(current_user())

    @property
    def active_name(self):
        return self.data_field.active_name

    @property
    def type_function(self):
        return self.field_type.type_function

    @property
    def munger_builder(self):
        return self.data_field.munger_builder

    def __str__(self):
        return '{0} of {1}'.format(self.field_type.type_name.capitalize(), self.data_field.active_name)


class CSVDocument(models.Model):
    csv_file = models.FileField(upload_to='csv-files')
