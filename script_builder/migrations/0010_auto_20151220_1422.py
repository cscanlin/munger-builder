# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0009_auto_20151106_1521'),
    ]

    operations = [
        migrations.AlterField(
            model_name='csvdocument',
            name='csv_file',
            field=models.FileField(upload_to=b'csv-files'),
        ),
    ]
