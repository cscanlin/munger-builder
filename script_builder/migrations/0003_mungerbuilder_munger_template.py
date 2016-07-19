# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0002_remove_mungerbuilder_munger_template'),
    ]

    operations = [
        migrations.AddField(
            model_name='mungerbuilder',
            name='munger_template',
            field=models.FilePathField(max_length=200, path='script_builder/templates/munger_templates', default='pandas_munger_template_basic.html'),
        ),
    ]
