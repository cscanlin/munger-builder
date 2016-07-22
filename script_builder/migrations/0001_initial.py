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
                ('csv_file', models.FileField(upload_to='csv-files')),
            ],
        ),
        migrations.CreateModel(
            name='DataField',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(editable=False, db_index=True)),
                ('current_name', models.CharField(max_length=200)),
                ('new_name', models.CharField(blank=True, null=True, max_length=200)),
            ],
            options={
                'ordering': ('order',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FieldType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type_name', models.CharField(max_length=200)),
                ('type_function', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='MungerBuilder',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('munger_name', models.CharField(max_length=200)),
                ('munger_template', models.FilePathField(path='script_builder/templates/munger_templates', max_length=200, default='pandas_munger_template_basic.html')),
                ('input_path', models.CharField(blank=True, max_length=999, default='')),
                ('output_path', models.CharField(blank=True, max_length=999, default='')),
                ('rows_to_delete_top', models.IntegerField(blank=True, null=True)),
                ('rows_to_delete_bottom', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='datafield',
            name='field_types',
            field=models.ManyToManyField(blank=True, related_name='field_types', to='script_builder.FieldType', related_query_name='field_types'),
        ),
        migrations.AddField(
            model_name='datafield',
            name='munger_builder',
            field=models.ForeignKey(related_name='data_fields', to='script_builder.MungerBuilder', related_query_name='data_fields'),
        ),
    ]
