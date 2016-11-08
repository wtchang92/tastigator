from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Restaurant, Review
from foodies.models import Foodie
from django.core.urlresolvers import reverse

from django.conf import settings
# Create your tests here.


class RestaurantNonGuideTests(TestCase):
    """
    Ensure non-guide users cannot create a new Restaurant object.
    """
    def setUp(self):
        user = User.objects.create(username='test_user')
        user.set_password('123qazwsx')
        user.save()
        self.token = Token.objects.create(user=user).key
        self.c = Client()

    #non-guide should return 403.
    def test_create_restaurant(self):
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        data =  {"name": "test_restaurant","description": "test test","street": "147-45 84th ave","city": "briarwood","state": "NY"}
        response = self.c.post('/api/restaurants/', data, format='json', **header)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "REST auth failed - "+str(response.status_code))
        self.assertEqual(Restaurant.objects.count(), 0)

class RestaurantGuideTests(TestCase):
    """
    Ensure guides can create a new Restaurant object.
    """
    def setUp(self):
        user = User.objects.create(username='test_user')
        user.set_password('123qazwsx')
        user.save()
        self.token = Token.objects.create(user=user).key
        f = Foodie.objects.all()[0]
        f.is_guide = True
        f.save()
        self.c = Client()

    #guide should return 201.
    def test_create_restaurant(self):
        header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        data =  {"name": "test_restaurant","description": "test test","street": "147-45 84th ave","city": "briarwood","state": "NY"}
        response = self.c.post('/api/restaurants/', data, format='json', **header)
        self.assertEqual(Restaurant.objects.count(), 1)
        self.assertEqual(Restaurant.objects.get(id=1).name, 'test_restaurant')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Should have created but failed - "+str(response.status_code))
        self.assertEqual(Restaurant.objects.get(id=1).status, 'newly added', "Failed status - "+ Restaurant.objects.get().status)

class ReviewTests(TestCase):
    """
    Ensure reviews can create be created for a visited restaurant
    """
    def setUp(self):
        user = User.objects.create(username='test_user')
        user.set_password('123qazwsx')
        user.save()
        self.token = Token.objects.create(user=user).key
        f = Foodie.objects.all()[0]
        f.is_guide = True
        f.save()
        self.c = Client()
        self.header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token)}
        data =  {"name": "test_restaurant","description": "test test","street": "147-45 84th ave","city": "briarwood","state": "NY"}
        self.c.post('/api/restaurants/', data, format='json', **self.header)
        self.restaurant = Restaurant.objects.get(id=1)

    def test_invalid_create_review(self):
        """
        return 400 for posting reviews for "newly added" restauraunts
        """
        self.assertEqual(Restaurant.objects.get(id=1).status, 'newly added', "Failed status - "+ Restaurant.objects.get().status)
        data =  {"subject": "test_review","restaurant": 1,"score": 10,"comment":"test_review"}
        response = self.c.post('/api/reviews/', data, format='json', **self.header)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Should have failed - "+str(response.status_code))
        self.assertEqual(Review.objects.count(), 0)

    def test_valid_create_review(self):
        """
        return 201 for posting reviews for "newly added" restauraunts
        """
        self.restaurant.status="visited"
        self.restaurant.save()
        self.assertEqual(Restaurant.objects.get(id=1).status, 'visited', "Failed status - "+ Restaurant.objects.get().status)
        data =  {"subject": "test_review","restaurant": 1,"score": 10,"comment":"test_review"}
        response = self.c.post('/api/reviews/', data, format='json', **self.header)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Should have created - "+str(response.status_code))
        self.assertEqual(Review.objects.count(), 1)

