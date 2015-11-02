from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib.auth.decorators import login_required

@login_required
def app_index(request):
    template = loader.get_template('app_index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))
