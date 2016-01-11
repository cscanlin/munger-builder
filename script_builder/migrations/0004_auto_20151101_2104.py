# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0003_auto_20151101_2059'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fieldtype',
            old_name='name',
            new_name='field_name',
        ),
    ]
