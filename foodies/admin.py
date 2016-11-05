from django.contrib import admin

# Register your models here.
from .models import Foodie, ProfileImage

admin.site.register(Foodie)
admin.site.register(ProfileImage)
