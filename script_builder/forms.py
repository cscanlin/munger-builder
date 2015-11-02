from django import forms
from django.forms import ModelForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Field, Fieldset, Button, ButtonHolder, Submit, Div, HTML, Row
from crispy_forms.bootstrap import InlineField, AppendedText, PrependedText, FormActions, FieldWithButtons, StrictButton

from .models import MungerBuilder

class SetupForm(ModelForm):
    class Meta:
        model = MungerBuilder
        fields = '__all__'

    helper = FormHelper()

    # helper.form_show_labels = False
    # helper.form_class = 'form-inline'
    # helper.form_class = 'audience-form'

    helper.form_id = 'id-SetupForm'
    # helper.field_template = 'bootstrap3/layout/inline_field.html'
    helper.form_method = 'post'
    # helper.form_action = 'submit_setup_form'
    helper.add_input(Submit("submit", "Save"))

class FieldParser(forms.Form):

    helper = FormHelper()

    helper.form_show_labels = False
    # helper.form_class = 'form-inline'
    helper.form_class = 'audience-form'

    helper.form_id = 'id-AudienceForm'
    helper.field_template = 'bootstrap3/layout/inline_field.html'
    helper.form_method = 'post'
    # helper.form_action = 'submit_fields_paste'
    helper.add_input(Submit("submit", "Save"))

    fields_paste = forms.CharField(label='Paste fields separated by comma, tab, or new line', max_length=999)

class UploadFileForm(forms.Form):
    csv_file = forms.FileField()
