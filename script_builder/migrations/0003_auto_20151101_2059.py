# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0002_auto_20151025_0101'),
    ]

    operations = [
        migrations.CreateModel(
            name='FieldType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.RemoveField(
            model_name='datafield',
            name='aggregate_type',
        ),
        migrations.RemoveField(
            model_name='datafield',
            name='include_field',
        ),
        migrations.RemoveField(
            model_name='datafield',
            name='is_index',
        ),
        migrations.AddField(
            model_name='datafield',
            name='field_type',
            field=models.ManyToManyField(to='script_builder.FieldType'),
        ),
    ]
