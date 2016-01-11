# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0008_auto_20151106_1051'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mungerbuilder',
            old_name='input_folder',
            new_name='input_path',
        ),
        migrations.RenameField(
            model_name='mungerbuilder',
            old_name='output_folder',
            new_name='output_path',
        ),
        migrations.RemoveField(
            model_name='mungerbuilder',
            name='input_filename',
        ),
        migrations.RemoveField(
            model_name='mungerbuilder',
            name='output_filename',
        ),
    ]
