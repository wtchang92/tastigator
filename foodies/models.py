from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from django.utils.text import slugify

# Create your models here.

class Foodie(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_guide = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

def foodie_saved_receiver(sender, instance, created, *args, **kwargs):
    user = instance
    foodie = Foodie.objects.filter(user = user)
    if not foodie:
        new_foodie = Foodie()
        new_foodie.user = user
        new_foodie.save()

post_save.connect(foodie_saved_receiver,sender = User)

def image_upload_to(instance, filename):
    title = instance.owner.user.username+str(instance.owner.user.id)
    print("Image title: "+title)
    slug = slugify(title)
    return "profile_images/%s/%s" %(slug, filename)

class ProfileImage(models.Model):
    owner = models.OneToOneField(Foodie, on_delete=models.CASCADE)
    datafile = models.ImageField(upload_to=image_upload_to)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.owner)



