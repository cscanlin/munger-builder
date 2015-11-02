# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CSVDocument',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('csv_file', models.FileField(upload_to=b'csv-files/%Y-%m')),
            ],
        ),
        migrations.CreateModel(
            name='DataField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('include_field', models.BooleanField(default=False)),
                ('is_index', models.BooleanField(default=False)),
                ('current_name', models.CharField(max_length=200)),
                ('new_name', models.CharField(max_length=200, null=True, blank=True)),
                ('aggregate_type', models.CharField(default=None, max_length=20, null=True, blank=True, choices=[(None, b'None'), (b'count', b'Count'), (b'sum', b'Sum'), (b'mean', b'Average'), (b'median', b'Median')])),
            ],
        ),
        migrations.CreateModel(
            name='MungerBuilder',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('munger_name', models.CharField(max_length=200)),
                ('input_folder', models.CharField(max_length=999)),
                ('input_filename', models.CharField(max_length=200)),
                ('output_folder', models.CharField(max_length=999, null=True, blank=True)),
                ('output_filename', models.CharField(max_length=200, null=True, blank=True)),
                ('rows_to_delete_top', models.IntegerField(null=True, blank=True)),
                ('rows_to_delete_bottom', models.IntegerField(null=True, blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='datafield',
            name='munger_builder',
            field=models.ForeignKey(to='script_builder.MungerBuilder'),
        ),
    ]
