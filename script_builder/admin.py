from django.contrib import admin

from .models import MungerBuilder, DataField, FieldType

from guardian.admin import GuardedModelAdmin

class DataFieldInline(admin.TabularInline):
    model = DataField

class MungerBuilderAdmin(GuardedModelAdmin):
    inlines = [
        DataFieldInline,
    ]

admin.site.register(MungerBuilder, MungerBuilderAdmin)
admin.site.register(DataField)
admin.site.register(FieldType)
