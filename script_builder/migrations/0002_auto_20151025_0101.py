# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datafield',
            name='munger_builder',
            field=models.ForeignKey(related_query_name=b'data_fields', related_name='data_fields', to='script_builder.MungerBuilder'),
        ),
    ]
