from django.contrib import admin

from .models import MungerBuilder, DataField, FieldType, PivotField

from guardian.admin import GuardedModelAdmin

from ordered_model.admin import OrderedModelAdmin

class OrderedDataField(OrderedModelAdmin):
    list_display = ('active_name','move_up_down_links',)

class DataFieldInline(admin.TabularInline):
    model = DataField

class MungerBuilderAdmin(GuardedModelAdmin):
    inlines = [
        DataFieldInline,
    ]

admin.site.register(MungerBuilder, MungerBuilderAdmin)
admin.site.register(DataField, OrderedDataField)
admin.site.register(FieldType)
admin.site.register(PivotField)
