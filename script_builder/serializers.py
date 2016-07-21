from rest_framework import serializers
from .models import DataField


class MungerFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = DataField
        fields = ('id', 'munger_builder', 'current_name', 'new_name', 'field_types', 'active_name')

    def post(self, validated_data):
        field, created = DataField.objects.update_or_create(**validated_data)
        field.save()
        return field
