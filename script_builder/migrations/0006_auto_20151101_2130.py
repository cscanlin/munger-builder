# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0005_auto_20151101_2126'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fieldtype',
            old_name='field_name',
            new_name='type_name',
        ),
    ]
