from __future__ import absolute_import
import time

from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import StreamingHttpResponse

from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter

import scripts.run_munger
import scripts.build_munger

from script_builder.views import has_mb_permission
from script_builder.models import MungerBuilder

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
    return StreamingHttpResponse(
        content_generator(scripts.run_munger.main(munger_builder_id))
    )

def build_munger_output(request, munger_builder_id):

    if not has_mb_permission(munger_builder_id, request):
        return INDEX_REDIRECT

    script_string = scripts.build_munger.main(munger_builder_id)
    highlighted = highlight(script_string, PythonLexer(), HtmlFormatter())
    context = {'script_string': highlighted, 'mb_id': munger_builder_id,}
    return render(request, 'script_runner/build_munger_output.html', context)

def content_generator(script_main):
    for line in script_main:
        time.sleep(.1)
        # print '{0} <br />\n'.format(line)
        yield '{0} <br />\n'.format(line)
