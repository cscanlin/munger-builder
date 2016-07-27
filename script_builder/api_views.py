from guardian.shortcuts import get_objects_for_user

from .serializers import MungerSerializer, DataFieldSerializer, PivotFieldSerializer, FieldTypeSerializer

from rest_framework.response import Response
from rest_framework import status, filters, mixins, generics, permissions

class MungerPermissions(permissions.DjangoObjectPermissions):
    perms_map = {
        'GET': ['%(app_label)s.change_%(model_name)s'],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
        'OPTIONS': ['%(app_label)s.change_%(model_name)s'],
        'HEAD': ['%(app_label)s.change_%(model_name)s'],
    }
class MungerBuilderAPIView(MungerPermissions,
                           mixins.CreateModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.ListModelMixin,
                           generics.GenericAPIView):
    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.all()

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class Mungers(MungerBuilderAPIView):

    serializer_class = MungerSerializer
    filter_backends = (filters.DjangoObjectPermissionsFilter,)

    def post(self, request, *args, **kwargs):
        user = request.user
        if not self.over_munger_limit(user):
            return self.create(request, *args, **kwargs)
        else:
            return Response('Cannot Create more Munger Builders - Delete some to make space',
                            status=status.HTTP_403_FORBIDDEN)

    @staticmethod
    def over_munger_limit(user, max_munger_builders=5):
        current_munger_builders = get_objects_for_user(user, 'script_builder.change_mungerbuilder')
        if len(current_munger_builders) >= max_munger_builders and not user.is_superuser:
            return True
        else:
            return False

class DataFields(MungerBuilderAPIView):
    serializer_class = DataFieldSerializer

class PivotFields(MungerBuilderAPIView):
    serializer_class = PivotFieldSerializer

class FieldTypes(MungerBuilderAPIView):
    serializer_class = FieldTypeSerializer
