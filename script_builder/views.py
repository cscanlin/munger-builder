import os
import re
import csv
import json

from django.shortcuts import render, get_object_or_404, redirect, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib import messages
from django.contrib.auth.models import User
from django.conf import settings


from guardian.shortcuts import assign_perm, get_perms, get_objects_for_user

from .models import DataField, FieldType, CSVDocument, MungerBuilder
from .forms import SetupForm, FieldParser, UploadFileForm

import scripts.build_munger
import tasks

INDEX_REDIRECT = HttpResponseRedirect('/script_builder/munger_builder_index')

def munger_builder_index(request):

    munger_builder_list = get_objects_for_user(request.user, 'script_builder.change_mungerbuilder')

    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_builder/munger_builder_index.html', context)

def munger_tools(request, munger_builder_id):

    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    # if request.method == 'POST':
    #     return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(munger_builder.id))

    if not has_mb_permission(mb, request):
        return INDEX_REDIRECT

    context = {'mb': mb}
    return render(request, 'script_builder/munger_tools.html', context)

def munger_builder_setup(request, munger_builder_id=None):

    if request.user.id:
        max_munger_builders = 10
    else:
        max_munger_builders = 2

    if munger_builder_id:
        mb = MungerBuilder.objects.get(pk=munger_builder_id)
        if not has_mb_permission(mb, request):
            return INDEX_REDIRECT
        else:
            pass
    else:
        current_munger_builders = get_objects_for_user(request.user, 'script_builder.change_mungerbuilder')
        if len(current_munger_builders) >= max_munger_builders:
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

    form = SetupForm(instance=mb)

    context = {'form': form, 'formset': form, 'mb': mb}
    return render(request, 'script_builder/munger_builder_setup.html', context)


def field_parser(request, munger_builder_id):

    if not has_mb_permission(munger_builder_id, request):
        return INDEX_REDIRECT

    if request.method == 'POST':
        if 'upload-fields-csv' in request.POST:
            input_form = UploadFileForm(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, input_form, 'csv')

        else:
            upload_form = FieldParser(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, upload_form, 'text')

        return HttpResponseRedirect('/script_builder/munger_tools/{0}'.format(munger_builder_id))

    else:
        input_form = FieldParser()
        upload_form = UploadFileForm()

    context = {'input_form': input_form, 'upload_form': upload_form}
    return render(request, 'script_builder/field_parser.html', context)

def pivot_builder(request, munger_builder_id):
    mb = MungerBuilder.objects.get(pk=munger_builder_id)

    if not has_mb_permission(mb, request):
        return INDEX_REDIRECT

    fields = mb.data_fields.all()
    field_types = [ft.type_name for ft in FieldType.objects.all()]
    context = {'mb': mb, 'fields': fields, 'field_types': field_types}
    return render(request, 'script_builder/pivot_builder.html', context)

def download_munger(request, munger_builder_id):
    task = tasks.download_munger_async.delay(munger_builder_id)
    return render_to_response('script_builder/poll_for_download.html',
                              {'task_id': task.id })

def poll_for_download(request):
    task_id = request.GET.get("task_id")
    filename = request.GET.get("filename")

    if request.is_ajax():
        result = tasks.download_munger_async.AsyncResult(task_id)
        if result.ready():
            return HttpResponse(json.dumps({"filename": result.get()}))
        return HttpResponse(json.dumps({"filename": None}))

    file_path = os.path.join(settings.MEDIA_ROOT, 'user_munger_scripts', '{0}'.format(filename))
    with open(file_path, 'r') as mf:
        response = HttpResponse(mf, content_type='application/octet-stream')
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

def clear_field_data(munger_builder_id):
    for field in MungerBuilder.objects.get(pk=munger_builder_id).data_fields.all():
        field.field_types.clear()
        field.save()
