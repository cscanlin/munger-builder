import csv
import re
import json

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.forms.formsets import formset_factory
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.contrib import messages

from .models import DataField, CSVDocument, MungerBuilder
from .forms import SetupForm, FieldParser, UploadFileForm

def munger_builder_setup(request):
    if request.method == 'POST':
        mb = MungerBuilder()
        form = SetupForm(request.POST, instance=mb)
        munger_builder = form.save()

        return HttpResponseRedirect('/script_builder/field_parser/{0}'.format(munger_builder.id))

    form = SetupForm()

    context = {'form': form}
    return render(request, 'script_builder/munger_builder_setup.html', context)


def field_import(request, munger_builder_id):

    if request.method == 'POST':
        if 'upload-fields-csv' in request.POST:
            input_form = UploadFileForm(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, input_form, 'csv')

        else:
            upload_form = FieldParser(request.POST, request.FILES)
            fields = validate_and_save_fields(request, munger_builder_id, upload_form, 'text')

        # munger_builder_id =
        return HttpResponseRedirect('/script_builder/pivot_builder/{0}'.format(munger_builder_id))

    else:
        input_form = FieldParser()
        upload_form = UploadFileForm()

    context = {'input_form': input_form, 'upload_form': upload_form}
    return render(request, 'script_builder/field_parser.html', context)

def validate_and_save_fields(request, munger_builder_id, form, input_type):
    if form.is_valid():

        fields_list = parse_fields(form, request, input_type)

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

def parse_fields(form, request, input_type):
    if input_type == 'text':
        return re.split('[,\t\n]', form.cleaned_data['fields_paste'])

    if input_type == 'csv':
        new_csv = CSVDocument(csv_file=request.FILES['csv_file'])
        new_csv.save()
        reader = csv.DictReader(request.FILES['csv_file'])
        return reader.fieldnames

def pivot_builder(request, munger_builder_id):
    mb = MungerBuilder.objects.get(pk=munger_builder_id)
    fields = mb.data_fields.all()
    field_types = get_field_types()
    context = {'mb': mb, 'fields': fields, 'field_types': field_types}
    return render(request, 'script_builder/pivot_builder.html', context)

def get_field_types():
    return ['index'] + [agg[0] for agg in DataField.AGGREGATE_FUNCTIONS if agg[0]]

def save_pivot_fields(request, munger_builder_id):
    if request.is_ajax():
        request_data = request.POST
        active_fields_data = json.loads(request_data['active_fields'])

        clear_field_data(munger_builder_id)

        for field_data in active_fields_data:
            field_data['id'] = int(field_data['id'].split('-')[1])

            field_object = DataField.objects.get(pk=field_data['id'])
            field_object.new_name = field_data['new_name']

            if field_data['type'] == 'index':
                field_object.include_field = True
                field_object.is_index = True
            elif field_data['type'] in ['sum','count','mean','median']:
                field_object.include_field = True
                field_object.aggregate_type = field_data['type']
                field_object.is_index = False
            else:
                pass

            field_object.save()
    messages.success(request, 'Pivot Fields Saved Successfully')
    return HttpResponse("OK")

def clear_field_data(munger_builder_id):
    for field in MungerBuilder.objects.get(pk=munger_builder_id).data_fields.all():
        field.include_field = False
        field.is_index = False
        field.aggregate_type = None
        field.save()
