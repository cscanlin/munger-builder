from django.contrib import admin

from .models import MungerBuilder, DataField, FieldType

class DataFieldInline(admin.TabularInline):
    model = DataField

class MungerBuilderAdmin(admin.ModelAdmin):
    inlines = [
        DataFieldInline,
    ]

admin.site.register(MungerBuilder, MungerBuilderAdmin)
admin.site.register(DataField)
admin.site.register(FieldType)
