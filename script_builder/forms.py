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
    # helper.form_action = 'submit_setup'
    helper.add_input(Submit("submit", "Save"))

    helper.layout = Layout(
        InlineField('munger_name'),
        Fieldset(
            'Input/Output',
            HTML('<p>Input a full file path, or just the name of the file if you will run the script from the same directory as the source data</p>'),
            InlineField('input_path'),
            HTML('<p>If no path is entered, the output will be the same file as the script is located in.</p>'),
            InlineField('output_path'),
            InlineField('munger_template'),
            # css_class = 'collapse',
        ),
        Fieldset(
            'Pre-Processing',
            HTML('<p>You can remove rows from the top and/or bottom of your data before pivoting in case of extra headers or summary rows</p>'),
            InlineField('rows_to_delete_top'),
            InlineField('rows_to_delete_bottom'),
            # css_class = 'collapse',
        )
    )
    # helper.layout = Layout(
    #     Field('munger_name'),
    #     Accordion(
    #         AccordionGroup(
    #             'Input/Output',
    #             Field('input_folder'),
    #             Field('input_filename'),
    #             Field('output_folder'),
    #             Field('output_filename'),
    #         ),
    #         AccordionGroup('Second Group',
    #             'Pre-Processing',
    #             Field('rows_to_delete_top'),
    #             Field('rows_to_delete_bottom'),
    #         )
    #     )
    # )

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
