from django.db import models
from foodies.models import Foodie
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg

from django.utils.text import slugify

# Create your models here.

POLLS_STATUS_CHOICES = (('open', 'Open'),
                        ('closed', 'Closed'),
                        )

RESTAURANT_STATUSES = (('visited', 'Visited'),
                        ('newly added', 'Newly Added'),
                        )

THUMB_DIRECTION = (('up', 'Up'),
          ('down','Down'),
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

    @property
    def thumb_downs(self):
        thumbs = Thumb.objects.filter(restaurant=self, up_or_down='down').count()
        return thumbs

    @property
    def score_average(self):
        query_set = Review.objects.filter(restaurant=self)
        average = None
        if query_set.count() > 0:
            sum = 0
            for review in query_set:
                sum += review.score
            average = sum / query_set.count()
        return average


class Review(models.Model):
    foodie = models.ForeignKey(Foodie)
    subject = models.CharField(max_length=80, null=False)
    restaurant = models.ForeignKey(Restaurant)
    score = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True, validators=[MinValueValidator(0),
                                       MaxValueValidator(10)])
    comment = models.CharField(max_length=800, null=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%d - %s review for restaurant %s" %(self.id, self.foodie, self.restaurant)

class Feedback(models.Model):
    review = models.ForeignKey(Review)
    foodie = models.ForeignKey(Foodie)
    message = models.CharField(max_length=144, null=False, blank=False)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s comment for review %s" %(self.foodie, self.review)


class Thumb(models.Model):
    restaurant = models.ForeignKey(Restaurant)
    foodie = models.ForeignKey(Foodie)
    up_or_down = models.CharField(max_length=120, choices=THUMB_DIRECTION, null=False,blank=False)

    def __str__(self):
        return "%s thumbed %s %s " %(self.foodie,self.up_or_down,self.restaurant)