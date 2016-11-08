from django.db import models
from foodies.models import Foodie

from django.utils.text import slugify

# Create your models here.

POLLS_STATUS_CHOICES = (('open', 'Open'),
                        ('closed', 'Closed'),
                        )

RESTAURANT_STATUSES = (('visited', 'Visited'),
                        ('newly added', 'Newly Added'),
                        )

class Restaurant(models.Model):
    name = models.CharField(max_length = 120)
    description = models.CharField(max_length=400, null=True)
    street = models.CharField(max_length=120)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    lat = models.DecimalField(max_digits=12,decimal_places=10)
    log = models.DecimalField(max_digits=12,decimal_places=10)
    status = models.CharField(max_length=120, choices=RESTAURANT_STATUSES, default='newly added')
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_address(self):
        full_address = "%s, %s, %s %s" %(self.street, self.city, self.state)
        return full_address


class Review(models.Model):
    foodie = models.ForeignKey(Foodie)
    subject = models.CharField(max_length=80, null=False)
    restaurant = models.ForeignKey(Restaurant)
    score = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    comment = models.CharField(max_length=800, null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

