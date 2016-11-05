from django.db import models
from foodies.models import Foodie
from restaurants.models import Restaurant

from django.utils.text import slugify

# Create your models here.

POLLS_STATUS_CHOICES = (('open', 'Open'),
                        ('closed', 'Closed'),
                        )


class Poll(models.Model):
    title = models.CharField(max_length=80, null=False)
    description = models.CharField(max_length=320, null=False)
    creator = models.ForeignKey(Foodie)
    status = models.CharField(max_length=120, choices=POLLS_STATUS_CHOICES, default='open')
    restaurants = models.ManyToManyField(Restaurant)
    added = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title+'_'+str(self.id)


class Vote(models.Model):
    foodie = models.ForeignKey(Foodie)
    poll = models.ForeignKey(Poll)
    choice = models.ForeignKey(Restaurant)

    def __str__(self):
        return str(self.foodie)+'_vote_in_poll_'+str(self.id)