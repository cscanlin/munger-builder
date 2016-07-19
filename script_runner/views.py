
import time

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import StreamingHttpResponse
from django.core.urlresolvers import reverse

from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter

from scripts import run_munger, build_munger

from script_builder.views import has_mb_permission
from script_builder.models import MungerBuilder

INDEX_REDIRECT = HttpResponseRedirect('/script_builder/munger_builder_index')

@user_passes_test(lambda u: u.is_superuser)
def script_runner_index(request):
    munger_builder_list = MungerBuilder.objects.order_by('id')
    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_runner/script_runner_index.html', context)

@user_passes_test(lambda u: u.is_superuser)
def munger_builder_index(request):
    munger_builder_list = MungerBuilder.objects.order_by('id')
    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'script_runner/munger_builder_index.html', context)

@user_passes_test(lambda u: u.is_superuser)
def run_munger_output(request, munger_builder_id):
    pretext_url = reverse('munger_tools', args=[munger_builder_id])
    pretext = "<p><a class=back-link href=\"{0}\">< Munger Tools</a></p>".format(pretext_url)
    return StreamingHttpResponse(
        content_generator(run_munger.main(munger_builder_id), pretext=pretext)
    )

def build_munger_output(request, munger_builder_id):

    if not has_mb_permission(munger_builder_id, request):
        return INDEX_REDIRECT

    mb = MungerBuilder.objects.get(pk=munger_builder_id)
    print(mb.munger_template)

    script_string = build_munger.main(munger_builder_id)
    highlighted = highlight(script_string, PythonLexer(), HtmlFormatter())
    context = {'script_string': highlighted, 'mb_id': munger_builder_id}
    return render(request, 'script_runner/build_munger_output.html', context)

def content_generator(script_main, pretext='', posttext=''):
    yield pretext
    for line in script_main:
        time.sleep(.1)
        yield '{0} <br />\n'.format(line)
    yield posttext
