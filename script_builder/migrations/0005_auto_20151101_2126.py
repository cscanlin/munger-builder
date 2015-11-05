# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0004_auto_20151101_2104'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datafield',
            name='field_type',
        ),
        migrations.AddField(
            model_name='datafield',
            name='field_types',
            field=models.ManyToManyField(to='script_builder.FieldType', blank=True),
        ),
    ]
