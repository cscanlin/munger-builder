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
from .serializers import MungerFieldSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics

INDEX_REDIRECT = HttpResponseRedirect('/script_builder/munger_builder_index')

class MungerFieldList(APIView):
    def get(self, request, munger_builder_id, format=None):
        if not has_mb_permission(munger_builder_id, request):
            return None
        field_list = MungerBuilder.objects.get(pk=munger_builder_id).data_fields.all()
        serializer = MungerFieldSerializer(field_list, many=True)
        return Response(serializer.data)

class MungerField(mixins.CreateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset = DataField.objects.all()
    serializer_class = MungerFieldSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

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
    if len(munger_builder_list) == 0:
        munger_builder_list = add_sample_munger(user)

    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_builder/munger_builder_index.html', context)

def get_user_or_anon(request):
    if not request.user.id:
        timestamp = int(time.time())
        user = User.objects.create_user(username='anon_{0}'.format(timestamp), password=timestamp)
        user.save()
        anon_user = authenticate(username='anon_{0}'.format(timestamp), password=timestamp)
        login(request, anon_user)
    else:
        user = request.user
    return user

def delete_munger(request, munger_builder_id):
    if not has_mb_permission(munger_builder_id, request):
        return INDEX_REDIRECT
    mb = get_object_or_404(MungerBuilder, pk=munger_builder_id)

    mb.delete()
    messages.success(request, '{0} Deleted Successfully'.format(mb.munger_name))
    return HttpResponseRedirect('/script_builder/munger_builder_index/')

def add_sample_munger(user):

    mb = MungerBuilder.objects.create(munger_name='Sample for {0}'.format(user.username), input_path='test_data.csv')
    mb.save()

    assign_perm('add_mungerbuilder', user, mb)
    assign_perm('change_mungerbuilder', user, mb)
    assign_perm('delete_mungerbuilder', user, mb)

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

    # if request.method == 'POST':
    #     return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(munger_builder.id))

    if not has_mb_permission(mb, request):
        return INDEX_REDIRECT

    context = {'mb': mb}
    return render(request, 'script_builder/munger_tools.html', context)

def munger_builder_setup(request, munger_builder_id=None):

    anon_check(request)

    max_munger_builders = 5

    if munger_builder_id:
        if not has_mb_permission(munger_builder_id, request):
            return INDEX_REDIRECT
        mb = MungerBuilder.objects.get(pk=munger_builder_id)
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

        return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(mb.id))

    else:
        form = SetupForm(instance=mb)
        context = {'form': form, 'formset': form, 'mb': mb}
        return render(request, 'script_builder/munger_builder_setup.html', context)


def field_parser(request, munger_builder_id):

    anon_check(request)
    if not has_mb_permission(munger_builder_id, request):
        return INDEX_REDIRECT

    mb = MungerBuilder.objects.get(pk=munger_builder_id)
    field_list = MungerBuilder.objects.get(pk=munger_builder_id).data_fields.all()

    if request.method == 'POST':
        if 'upload-fields-csv' in request.POST:
            input_form = UploadFileForm(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, input_form, 'csv')

        else:
            upload_form = FieldParser(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, upload_form, 'text')

        return HttpResponseRedirect('/script_builder/field_parser/{0}'.format(munger_builder_id))

    else:
        messages.info(request, 'Paste in a list of comma or tab separated fields, or upload a csv with the desired columns')
        input_form = FieldParser()
        upload_form = UploadFileForm()

    context = {'field_list': field_list, 'input_form': input_form, 'upload_form': upload_form, 'mb': mb}
    return render(request, 'script_builder/field_parser.html', context)

def pivot_builder(request, munger_builder_id):

    anon_check(request)

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    if not has_mb_permission(mb, request):
        return INDEX_REDIRECT

    fields = mb.data_fields.all()
    field_type_names = [ft.type_name for ft in FieldType.objects.all()]
    context = {'mb': mb, 'fields': fields, 'field_type_names': field_type_names}
    return render(request, 'script_builder/pivot_builder_react.html', context)
    # return render(request, 'script_builder/pivot_builder.html', context)

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

def has_mb_permission(mb, request):
    if not isinstance(mb, MungerBuilder):
        mb = MungerBuilder.objects.get(pk=mb)
    return request.user.has_perm('script_builder.change_mungerbuilder', mb)

def validate_and_save_fields(request, munger_builder_id, form, input_type):
    if form.is_valid():

        fields_list = parse_text_fields(form, request, input_type)

        mb = MungerBuilder.objects.get(pk=munger_builder_id)

        field_objects = []
        for field_name in fields_list:
            field, created = DataField.objects.get_or_create(
                munger_builder=mb,
                current_name=field_name,
            )
            field.save()
            field_objects.append(field)

        return field_objects

    else:
        messages.error(request, 'Field Creation Failed Unexpectedly')
        return None

def parse_text_fields(form, request, input_type):
    if input_type == 'text':
        return re.split('[,\t\n]', form.cleaned_data['fields_paste'])

    if input_type == 'csv':
        new_csv = CSVDocument(csv_file=request.FILES['csv_file'])
        new_csv.save()
        reader = csv.DictReader(request.FILES['csv_file'])
        return reader.fieldnames

def save_pivot_fields(request, munger_builder_id):
    if request.is_ajax():
        active_fields_data = json.loads(request.POST['active_fields'])

        clear_field_data(munger_builder_id)

        for field_data in active_fields_data:
            field_object = DataField.objects.get(pk=field_data['field_id'])
            field_object.new_name = field_data['new_name']

            field_type = FieldType.objects.get(type_name=field_data['type'])
            field_object.field_types.add(field_type)

            field_object.save()

    messages.success(request, 'Pivot Fields Saved Successfully')
    return HttpResponse("OK")

def add_pivot_field(request, munger_builder_id):
    if request.is_ajax():

        num_new_fields = len(DataField.objects.filter(current_name__startswith='New Field'))
        if num_new_fields > 0:
            new_field_name = 'New Field {0}'.format(num_new_fields+1)
        else:
            new_field_name = 'New Field'

        field_object = DataField(
            munger_builder=MungerBuilder.objects.get(pk=munger_builder_id),
            current_name=new_field_name,
        )
        field_object.save()

        messages.success(request, 'Field Added Successfully')
        return HttpResponse("OK")

def delete_pivot_field(request, field_id):
    if request.is_ajax():

        field = get_object_or_404(DataField, pk=field_id)
        if not request.user.has_perm('script_builder.change_datafield', field):
            return INDEX_REDIRECT

        field.delete()
        messages.success(request, '{0} Deleted Successfully'.format(field.current_name))
        return HttpResponse("OK")

def clear_field_data(munger_builder_id):
    for field in MungerBuilder.objects.get(pk=munger_builder_id).data_fields.all():
        field.field_types.clear()
        field.save()

def anon_check(request):
    if 'anon_' in request.user.username:
        messages.warning(request, 'You are logged in as an anonymous user. You may not be able to transfer any mungers to a permanent account in the future. Register to save mungers.')
