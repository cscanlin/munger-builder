from rest_framework import serializers
from .models import DataField


class MungerFieldSerializer(serializers.ModelSerializer):

    class Meta:
        model = DataField
        fields = ('munger_builder', 'current_name', 'new_name', 'field_types')
