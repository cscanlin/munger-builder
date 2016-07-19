# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CSVDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('csv_file', models.FileField(upload_to='csv-files')),
            ],
        ),
        migrations.CreateModel(
            name='DataField',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('order', models.PositiveIntegerField(editable=False, db_index=True)),
                ('current_name', models.CharField(max_length=200)),
                ('new_name', models.CharField(max_length=200, blank=True, null=True)),
            ],
            options={
                'abstract': False,
                'ordering': ('order',),
            },
        ),
        migrations.CreateModel(
            name='FieldType',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('type_name', models.CharField(max_length=200)),
                ('type_function', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='MungerBuilder',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('munger_name', models.CharField(max_length=200)),
                ('munger_template', models.FilePathField(default='pandas_munger_template_basic.html', max_length=200, path='script_builder/templates/munger_templates')),
                ('input_path', models.CharField(default='', max_length=999, blank=True)),
                ('output_path', models.CharField(default='', max_length=999, blank=True)),
                ('rows_to_delete_top', models.IntegerField(blank=True, null=True)),
                ('rows_to_delete_bottom', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='datafield',
            name='field_types',
            field=models.ManyToManyField(related_name='field_types', blank=True, related_query_name='field_types', to='script_builder.FieldType'),
        ),
        migrations.AddField(
            model_name='datafield',
            name='munger_builder',
            field=models.ForeignKey(to='script_builder.MungerBuilder', related_query_name='data_fields', related_name='data_fields'),
        ),
    ]
