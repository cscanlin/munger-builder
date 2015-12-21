# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0010_auto_20151220_1422'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mungerbuilder',
            name='input_path',
            field=models.CharField(default=b'', max_length=999, blank=True),
        ),
        migrations.AlterField(
            model_name='mungerbuilder',
            name='output_path',
            field=models.CharField(default=b'', max_length=999, blank=True),
        ),
    ]
