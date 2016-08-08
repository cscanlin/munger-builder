import os
import re
import csv
import json
import time

from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.conf import settings

from guardian.shortcuts import assign_perm, get_objects_for_user

from .models import DataField, FieldType, CSVDocument, MungerBuilder, PivotField
from .tasks import download_munger_async, download_test_data_async

INDEX_REDIRECT = HttpResponseRedirect('/script_builder/munger_builder_index')

def munger_builder_index(request):

    user = get_user_or_create_anon(request)

    anon_check(request)

    munger_builder_list = get_objects_for_user(user, 'script_builder.change_mungerbuilder')
    if len(munger_builder_list) == 0:
        munger_builder_list = add_sample_munger(user)

    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_builder/munger_builder_index.html', context)

def get_user_or_create_anon(request):
    if not request.user.id:
        timestamp = int(time.time())
        credentials = {
            'username': 'anon_{0}'.format(timestamp),
            'password': timestamp,
        }
        user = User.objects.create_user(**credentials)
        user.save()
        assign_perm('script_builder.add_mungerbuilder', user)
        assign_perm('script_builder.add_fieldtype', user)
        assign_perm('script_builder.add_datafield', user)
        assign_perm('script_builder.add_pivotfield', user)
        anon_user = authenticate(**credentials)
        login(request, anon_user)
    else:
        user = request.user
    return user

def add_sample_munger(user):

    mb = MungerBuilder.objects.create(
        munger_name='Sample for {0}'.format(user.username),
        input_path='test_data.csv',
        is_sample=True,
    )
    mb.save()
    mb.assign_perms(user)

    sample_field_dict = {
        'order_num': ['count'],
        'product': None,
        'sales_name': ['index'],
        'region': ['column'],
        'revenue': ['mean', 'sum'],
        'shipping': ['median'],
    }

    for field_name, field_types in sample_field_dict.items():
        data_field = DataField.objects.create(munger_builder=mb, current_name=field_name)
        data_field.save()
        data_field.assign_perms(user)
        if field_types:
            for type_name in field_types:
                field_type = FieldType.objects.get(type_name=type_name)
                PivotField.objects.create(data_field=data_field, field_type=field_type).save()

    return get_objects_for_user(user, 'script_builder.change_mungerbuilder')

def new_munger_builder(request):
    user = get_user_or_create_anon(request)
    mb = MungerBuilder.objects.create(munger_name='New Munger - {0}'.format(user.username))
    mb.save()
    mb.assign_perms(user)
    return HttpResponseRedirect('/script_builder/pivot_builder/{0}'.format(mb.id))

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
        anon_message = """You are logged in as an anonymous user.
                       You may not be able to transfer any mungers to a permanent account in the future.
                       Register to save mungers."""
        messages.warning(request, anon_message)
