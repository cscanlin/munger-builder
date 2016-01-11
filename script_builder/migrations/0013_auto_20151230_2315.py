# -*- coding: utf-8 -*-


from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('script_builder', '0012_fieldtype_type_function'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='datafield',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='datafield',
            name='order',
            field=models.PositiveIntegerField(default=1, editable=False, db_index=True),
            preserve_default=False,
        ),
    ]
