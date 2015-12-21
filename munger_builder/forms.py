from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms

class UserRegistrationForm(UserCreationForm):

    class Meta:
        model = User
        fields = ('username', 'email',)
