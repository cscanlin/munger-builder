# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0006_auto_20151101_2130'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mungerbuilder',
            name='input_filename',
            field=models.CharField(max_length=200, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='mungerbuilder',
            name='input_folder',
            field=models.CharField(max_length=999, null=True, blank=True),
        ),
    ]
