from django.contrib.auth.models import User
from django.test import TestCase
from script_builder.models import MungerBuilder, FieldType, DataField

from guardian.shortcuts import assign_perm

class MungerTestCase(TestCase):
    def setUp(self):
        self.field_type_dict = {
            'column': 'column',
            'index': 'index',
            'count': 'len',
            'sum': 'np.sum',
            'mean': 'np.mean',
            'median': 'np.median',
        }
        self.add_field_types()
        self.user = User.objects.create_user(
            username='test_case_user', email='test_case_user@gmail.com', password='test_pw'
        )
        self.munger = MungerBuilder.objects.create(munger_name='test_munger', input_path='test_data.csv')
        self.munger.save()
        self.add_data_fields()

    def add_field_types(self):
        field_type_list = [FieldType(type_name=k, type_function=v) for k, v in self.field_type_dict.items()]
        FieldType.objects.bulk_create(field_type_list)

    def add_data_fields(self):
        test_field_dict = {
            'order_num': ['count'],
            'product': [None],
            'sales_name': ['index'],
            'region': ['column'],
            'revenue': ['mean', 'sum'],
            'shipping': ['median'],
        }

        for field_name, field_types in test_field_dict.items():
            data_field = DataField.objects.create(munger_builder=self.munger, current_name=field_name)
            data_field.save()
            if field_types != [None]:
                for type_name in field_types:
                    field_type = FieldType.objects.get(type_name=type_name)
                    data_field.field_types.add(field_type)
                data_field.save()

    def test_object_level_permissions(self):
        assign_perm('add_mungerbuilder', self.user, self.munger)
        assign_perm('change_mungerbuilder', self.user, self.munger)
        assign_perm('delete_mungerbuilder', self.user, self.munger)
        self.assertTrue(self.user.has_perm('script_builder.change_mungerbuilder', self.munger))

        # fields = self.munger.data_fields.all()

    def test_index_fields(self):
        self.assertEqual(['sales_name'], self.munger.index_fields)

    def test_column_fields(self):
        print(self.munger.agg_fields())
        self.assertEqual(['region'], self.munger.column_fields)

    def test_agg_fields(self):
        ft_dict = self.field_type_dict
        agg_fields_dict = {
            'order_num': set([ft_dict['count']]),
            'revenue': set([ft_dict['mean'], ft_dict['sum']]),
            'shipping': set([ft_dict['median']]),
        }

        self.assertEqual(agg_fields_dict, self.munger.agg_fields(aggs_as_set=True))
