from __future__ import absolute_import
import time
import subprocess
PIPE = subprocess.PIPE

from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import StreamingHttpResponse

import scripts.munger
from script_builder.models import MungerBuilder
import task_scheduler.tasks

@login_required
def script_runner_index(request):
    template = loader.get_template('task_scheduler/script_runner_index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

@login_required
def munger_builder_index(request):
    munger_builder_list = MungerBuilder.objects.order_by('id')
    context = {'munger_builder_list': munger_builder_list}
    return render(request, 'task_scheduler/munger_builder_index.html', context)


@login_required
def munger_builder_results(request, munger_builder_id):
    return StreamingHttpResponse(
        content_generator(scripts.munger.main(munger_builder_id))
    )

def content_generator(script_main):
    for line in script_main:
        time.sleep(.5)
        yield '{0} <br />\n'.format(line)
