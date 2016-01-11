# -*- coding: utf-8 -*-


from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0007_auto_20151105_0019'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datafield',
            name='field_types',
            field=models.ManyToManyField(related_query_name=b'field_types', related_name='field_types', to='script_builder.FieldType', blank=True),
        ),
    ]
