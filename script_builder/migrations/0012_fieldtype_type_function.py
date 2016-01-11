# -*- coding: utf-8 -*-


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0011_auto_20151221_1108'),
    ]

    operations = [
        migrations.AddField(
            model_name='fieldtype',
            name='type_function',
            field=models.CharField(default='ch', max_length=200),
            preserve_default=False,
        ),
    ]
