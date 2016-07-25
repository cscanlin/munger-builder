import os
import re
import csv
import json
import time

from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.conf import settings

from guardian.shortcuts import assign_perm, get_objects_for_user

from .models import DataField, FieldType, CSVDocument, MungerBuilder
from .forms import SetupForm, FieldParser, UploadFileForm
from .tasks import download_munger_async, download_test_data_async
from .serializers import MungerSerializer, DataFieldSerializer

from rest_framework.response import Response
from rest_framework import status, filters, mixins, generics, permissions

INDEX_REDIRECT = HttpResponseRedirect('/script_builder/munger_builder_index')

class MungerPermissions(permissions.DjangoObjectPermissions):
    perms_map = {
        'GET': ['%(app_label)s.change_%(model_name)s'],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        'DELETE': ['%(app_label)s.delete_%(model_name)s'],
        'OPTIONS': ['%(app_label)s.change_%(model_name)s'],
        'HEAD': ['%(app_label)s.change_%(model_name)s'],
    }

class Mungers(MungerPermissions,
              mixins.CreateModelMixin,
              mixins.RetrieveModelMixin,
              mixins.UpdateModelMixin,
              mixins.DestroyModelMixin,
              mixins.ListModelMixin,
              generics.GenericAPIView):

    serializer_class = MungerSerializer
    filter_backends = (filters.DjangoObjectPermissionsFilter,)

    def get_queryset(self):
        return MungerBuilder.objects

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        user = request.user
        if 'pk' in kwargs:
            return self.update(request, *args, **kwargs)
        else:
            if not self.over_munger_limit(user):
                return self.create(request, *args, **kwargs)
            else:
                return Response('Cannot Create more Munger Builders - Delete some to make space',
                                status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def over_munger_limit(self, user, max_munger_builders=5):
        current_munger_builders = get_objects_for_user(user, 'script_builder.change_mungerbuilder')
        if len(current_munger_builders) >= max_munger_builders and not user.is_superuser:
            return True
        else:
            return False

class DataFields(MungerPermissions,
                 mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.ListModelMixin,
                 generics.GenericAPIView):

    serializer_class = DataFieldSerializer

    def get_queryset(self):
        return DataField.objects

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.update(request, *args, **kwargs)
        else:
            return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

def munger_builder_index(request):

    user = get_user_or_anon(request)

    anon_check(request)

    munger_builder_list = get_objects_for_user(user, 'script_builder.change_mungerbuilder')
    # if len(munger_builder_list) == 0:
    #     munger_builder_list = add_sample_munger(user)

    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_builder/munger_builder_index.html', context)

def get_user_or_anon(request):
    if not request.user.id:
        timestamp = int(time.time())
        credentials = {
            'username': 'anon_{0}'.format(timestamp),
            'password': timestamp,
        }
        user = User.objects.create_user(**credentials)
        user.save()
        assign_perm('script_builder.add_mungerbuilder', user)
        assign_perm('script_builder.add_datafield', user)
        anon_user = authenticate(**credentials)
        login(request, anon_user)
    else:
        user = request.user
    return user

def add_sample_munger(user):

    mb = MungerBuilder.objects.create(munger_name='Sample for {0}'.format(user.username), input_path='test_data.csv')
    mb.save()

    assign_perm('add_mungerbuilder', user, mb)
    assign_perm('change_mungerbuilder', user, mb)
    assign_perm('delete_mungerbuilder', user, mb)
    assign_perm('view_mungerbuilder', user, mb)

    sample_field_dict = {
        'order_num': ['count'],
        'product': [None],
        'sales_name': ['index'],
        'region': ['column'],
        'revenue': ['mean', 'sum'],
        'shipping': ['median'],
    }

    for field_name, field_types in sample_field_dict.items():
        data_field = DataField.objects.create(munger_builder=mb, current_name=field_name)
        data_field.save()
        if field_types != [None]:
            for type_name in field_types:
                field_type = FieldType.objects.get(type_name=type_name)
                data_field.field_types.add(field_type)
            data_field.save()

    return get_objects_for_user(user, 'script_builder.change_mungerbuilder')

def munger_tools(request, munger_builder_id):

    anon_check(request)

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    if request.method == 'POST':
        return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(munger_builder_id))

    if not mb.user_is_authorized():
        return INDEX_REDIRECT

    context = {'mb': mb}
    return render(request, 'script_builder/munger_tools.html', context)

def munger_builder_setup(request, munger_builder_id=None):

    anon_check(request)

    max_munger_builders = 5

    if munger_builder_id:
        mb = MungerBuilder.objects.get(pk=munger_builder_id)
        if not mb.user_is_authorized():
            return INDEX_REDIRECT
    else:
        user = request.user
        current_munger_builders = get_objects_for_user(user, 'script_builder.change_mungerbuilder')
        if len(current_munger_builders) >= max_munger_builders and not user.is_superuser:
            messages.warning(request, 'Cannot Create more Munger Builders - Delete some to make space')
            return INDEX_REDIRECT
        else:
            mb = None

    if request.method == 'POST':
        form = SetupForm(request.POST, instance=mb)
        mb = form.save()

        assign_perm('add_mungerbuilder', request.user, mb)
        assign_perm('change_mungerbuilder', request.user, mb)
        assign_perm('delete_mungerbuilder', request.user, mb)
        assign_perm('view_mungerbuilder', request.user, mb)

        return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(mb.id))

    else:
        form = SetupForm(instance=mb)
        context = {'form': form, 'formset': form, 'mb': mb}
        return render(request, 'script_builder/munger_builder_setup.html', context)

def pivot_builder(request, munger_builder_id):

    anon_check(request)

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    if not mb.user_is_authorized():
        return INDEX_REDIRECT

    return render(request, 'script_builder/pivot_builder_react.html', context={'mb': mb})

def download_munger(request, munger_builder_id):
    task = download_munger_async.delay(munger_builder_id)
    return render_to_response('script_builder/poll_for_download.html',
                              {'task_id': task.id, 'mb_id': munger_builder_id})

def download_test_data(request, munger_builder_id):
    task = download_test_data_async.delay(munger_builder_id)
    return render_to_response('script_builder/poll_for_download.html',
                              {'task_id': task.id, 'mb_id': munger_builder_id})

def poll_for_download(request):

    task_id = request.GET.get("task_id")
    filename = request.GET.get("filename")

    if filename == 'test_data.csv':
        async_func = download_test_data_async
        file_path = os.path.join(settings.STATIC_ROOT, filename)
    else:
        async_func = download_munger_async
        file_path = os.path.join(settings.MEDIA_ROOT, 'user_munger_scripts', '{0}'.format(filename))

    if request.is_ajax():
        result = async_func.AsyncResult(task_id)
        if result.ready():
            return HttpResponse(json.dumps({"filename": result.get()}))
        return HttpResponse(json.dumps({"filename": None}))

    with open(file_path, 'r') as f:
        response = HttpResponse(f, content_type='application/octet-stream')
        response['Content-Disposition'] = 'attachment; filename={0}'.format(filename)
        return response

# Helper Functions

def parse_text_fields(form, request, input_type):
    if input_type == 'text':
        return re.split('[,\t\n]', form.cleaned_data['fields_paste'])

    if input_type == 'csv':
        new_csv = CSVDocument(csv_file=request.FILES['csv_file'])
        new_csv.save()
        reader = csv.DictReader(request.FILES['csv_file'])
        return reader.fieldnames

def anon_check(request):
    if 'anon_' in request.user.username:
        messages.warning(request, 'You are logged in as an anonymous user. You may not be able to transfer any mungers to a permanent account in the future. Register to save mungers.')
