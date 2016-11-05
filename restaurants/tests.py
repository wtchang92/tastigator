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
            self.c = Client()
            self.c.login(username='test_user', password='123qazwsx')

        #non-guide should return 403.
        def test_create_restaurant(self):
            data =  {"name": "test_restaurant","description": "test test","street": "147-45 84th ave","city": "briarwood","state": "NY"}
            response = self.c.post('/api/restaurants/', data, format='json')
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "REST auth failed - "+str(response.status_code))
            self.assertEqual(User.objects.count(), 1)
            self.assertEqual(User.objects.get().username, 'test_user')

class RestaurantGuideTests(TestCase):
        """
        Ensure guides can create a new Restaurant object.
        """
        def setUp(self):
            user = User.objects.create(username='test_user')
            user.set_password('123qazwsx')
            user.save()
            f = Foodie.objects.all()[0]
            f.is_guide = True
            f.save()
            self.c = Client()
            self.c.login(username='test_user', password='123qazwsx')

        #guide should return 201.
        def test_create_restaurant(self):
            data =  {"name": "test_restaurant","description": "test test","street": "147-45 84th ave","city": "briarwood","state": "NY"}
            response = self.c.post('/api/restaurants/', data, format='json')
            self.assertEqual(User.objects.count(), 1)
            self.assertEqual(User.objects.get().username, 'test_user')
            self.assertEqual(User.objects.get().foodie.is_guide, True)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Should have created but failed - "+str(response.status_code))
