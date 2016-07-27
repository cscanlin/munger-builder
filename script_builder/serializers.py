from rest_framework import serializers
from .models import MungerBuilder, DataField

class DataFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataField
        fields = ('id', 'munger_builder', 'current_name', 'new_name', 'active_name')

class MungerSerializer(serializers.ModelSerializer):
    data_fields = DataFieldSerializer(many=True, read_only=True)

    class Meta:
        model = MungerBuilder
        fields = '__all__'
