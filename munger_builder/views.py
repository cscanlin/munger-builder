from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from guardian.shortcuts import assign_perm

from .forms import UserRegistrationForm

def home_page(request):
    return render_to_response('home.html', RequestContext(request))
    # return HttpResponseRedirect('/script_builder/munger_builder_index/')

@login_required
def app_index(request):
    template = loader.get_template('app_index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))


def register(request):
    context = RequestContext(request)

    if request.method == 'POST':

        user_form = UserRegistrationForm(data=request.POST)

        # If the two forms are valid...
        if user_form.is_valid():

            new_user = user_form.save()
            assign_perm('script_builder.add_mungerbuilder', new_user)
            assign_perm('script_builder.add_fieldtype', new_user)
            assign_perm('script_builder.add_datafield', new_user)
            assign_perm('script_builder.add_pivotfield', new_user)

            messages.success(request, "Thanks for registering. You are now logged in.")
            new_user = authenticate(username=request.POST['username'],
                                    password=request.POST['password1'])
            login(request, new_user)

            return HttpResponseRedirect('/script_builder/munger_builder_index/')

        else:
            input_dict = request.POST.dict()
            for key in input_dict:
                if not input_dict[key]:
                    messages.error(request, 'Please enter: {0}'.format(key))
            return HttpResponseRedirect('/register/')

    # Not a HTTP POST, so we render our form using two ModelForm instances.
    # These forms will be blank, ready for user input.
    else:
        user_form = UserRegistrationForm()

    # Render the template depending on the context.
    return render_to_response(
            'registration/register.html',
            {'user_form': user_form},
            context)
