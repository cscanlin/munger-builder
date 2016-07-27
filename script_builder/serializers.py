from rest_framework import serializers
from .models import MungerBuilder, DataField, PivotField, FieldType

class FieldTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldType
        fields = '__all__'

class DataFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataField
        fields = ('id', 'munger_builder', 'current_name', 'new_name', 'active_name')

class PivotFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = PivotField
        fields = '__all__'

class MungerSerializer(serializers.ModelSerializer):
    data_fields = DataFieldSerializer(many=True, read_only=True)
    pivot_fields = PivotFieldSerializer(many=True, read_only=True)
    field_types = FieldTypeSerializer(many=True, read_only=True)

    class Meta:
        model = MungerBuilder
        fields = ('munger_name', 'munger_template', 'input_path', 'output_path', 'rows_to_delete_top',
                  'rows_to_delete_bottom', 'data_fields', 'pivot_fields', 'field_types',
                  'default_aggregate_field_type')
