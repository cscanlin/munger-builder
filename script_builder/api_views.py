from guardian.shortcuts import get_objects_for_user

from .serializers import MungerSerializer, DataFieldSerializer, PivotFieldSerializer, FieldTypeSerializer

from rest_framework.response import Response
from rest_framework import status, filters, mixins, generics, permissions

class MungerPermissions(permissions.DjangoObjectPermissions):
    perms_map = {
        'GET': ['%(app_label)s.change_%(model_name)s'],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'PUT': ['%(app_label)s.change_%(model_name)s'],
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
        user = request.user
        if self.under_limit(user):
            return self.create(request, *args, **kwargs)
        else:
            error_string = 'Cannot Create more {} - Delete some to make space'.format(
                self._meta.model_name
            )
            return Response(error_string, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def under_limit(self, user):
        permission_name = 'script_builder.change_{}'.format(self._meta.model_name)
        current_objects = get_objects_for_user(user, permission_name)
        return len(current_objects) <= self.USER_OBJECT_LIMIT or user.is_superuser

class Mungers(MungerBuilderAPIView):
    USER_OBJECT_LIMIT = 5
    serializer_class = MungerSerializer
    filter_backends = (filters.DjangoObjectPermissionsFilter,)

class DataFields(MungerBuilderAPIView):
    USER_OBJECT_LIMIT = 100
    serializer_class = DataFieldSerializer

class PivotFields(MungerBuilderAPIView):
    USER_OBJECT_LIMIT = 100
    serializer_class = PivotFieldSerializer

class FieldTypes(MungerBuilderAPIView):
    USER_OBJECT_LIMIT = 10
    serializer_class = FieldTypeSerializer
