from django import forms
from django.forms import ModelForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Fieldset, Button, ButtonHolder, Submit, Div, HTML, Row
from crispy_forms.bootstrap import InlineField, AppendedText, PrependedText, FormActions, FieldWithButtons, StrictButton, Accordion, AccordionGroup, Tab

from .models import MungerBuilder

class SetupForm(ModelForm):
    class Meta:
        model = MungerBuilder
        fields = '__all__'

    helper = FormHelper()

    helper.form_show_labels = False
    # helper.form_class = 'form-inline'
    helper.form_class = 'setup-form'

    helper.form_id = 'id-SetupForm'
    helper.field_template = 'bootstrap3/layout/inline_field.html'
    helper.form_method = 'post'
    helper.form_action = 'submit_setup'
    helper.add_input(Submit("submit", "Save"))

    # helper.layout = Layout(
    #     InlineField('munger_name'),
    #     Fieldset(
    #         'Input/Output',
    #         InlineField('input_folder'),
    #         InlineField('input_filename'),
    #         InlineField('output_folder'),
    #         InlineField('output_filename'),
    #         # css_class = 'collapse',
    #     ),
    #     Fieldset(
    #         'Pre-Processing',
    #         InlineField('rows_to_delete_top'),
    #         InlineField('rows_to_delete_bottom'),
    #         # css_class = 'collapse',
    #     )
    # )
    helper.layout = Layout(
        InlineField('munger_name'),
        Accordion(
            AccordionGroup(
                'Input/Output',
                Field('input_folder'),
                Field('input_filename'),
                Field('output_folder'),
                Field('output_filename'),
            ),
            AccordionGroup('Second Group',
                'Pre-Processing',
                Field('rows_to_delete_top'),
                Field('rows_to_delete_bottom'),
            )
        )
    )

class FieldParser(forms.Form):

    helper = FormHelper()

    helper.form_show_labels = False
    # helper.form_class = 'form-inline'
    helper.form_class = 'field-form'

    helper.form_id = 'id-FieldParser'
    helper.field_template = 'bootstrap3/layout/inline_field.html'
    helper.form_method = 'post'
    # helper.form_action = 'submit_fields_paste'
    helper.add_input(Submit("submit", "Save"))

    fields_paste = forms.CharField(label='Paste fields separated by comma, tab, or new line', max_length=999)

class UploadFileForm(forms.Form):
    csv_file = forms.FileField()
