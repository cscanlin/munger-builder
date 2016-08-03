from rest_framework import serializers
from .models import MungerBuilder, DataField, PivotField, FieldType

class PartialAllowed(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.partial = True

class FieldTypeSerializer(PartialAllowed):
    class Meta:
        model = FieldType
        fields = '__all__'

class DataFieldSerializer(PartialAllowed):
    class Meta:
        model = DataField
        fields = ('id', 'munger_builder', 'current_name', 'new_name', 'active_name')

class PivotFieldSerializer(PartialAllowed):
    class Meta:
        model = PivotField

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.partial = True

class MungerSerializer(PartialAllowed):
    data_fields = DataFieldSerializer(many=True, read_only=True)
    pivot_fields = PivotFieldSerializer(many=True, read_only=True)
    field_types = FieldTypeSerializer(many=True, read_only=True)

    class Meta:
        model = MungerBuilder
        fields = ('munger_name', 'munger_template', 'input_path', 'output_path', 'rows_to_delete_top',
                  'rows_to_delete_bottom', 'data_fields', 'pivot_fields', 'field_types',
                  'default_aggregate_field_type', 'is_sample')
