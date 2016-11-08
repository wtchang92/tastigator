from django.contrib import admin

# Register your models here.
from .models import Poll, Vote

admin.site.register(Poll)
admin.site.register(Vote)