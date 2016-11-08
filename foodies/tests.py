from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import Foodie

# Create your tests here.


class UserCreateTests(TestCase):
        """
        Ensure a new account can be created.
        """
        def setUp(self):
            self.c = Client()

        #should return a created user
        def test_create_restaurant(self):
            data =  {"username": "test_user","email":"test@test.com","password": "123qazwsx","confirm_pass":"123qazwsx","new_pass":"","new_confirm_pass":""}
            response = self.c.post('/api/users/', data, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, "REST User Create failed - "+str(response.status_code))
            self.assertEqual(User.objects.count(), 1)
            self.assertEqual(User.objects.get().username, 'test_user')
            self.assertEqual(Foodie.objects.count(), 1) #Check a foodie profile is created

class UserTokenTests(TestCase):
        """
        Ensure user can "login" by Auth Token
        """
        def setUp(self):
            user = User.objects.create(username='test_user')
            user.set_password('123qazwsx')
            user.save()
            self.c = Client()
            # self.c.login(username='test_user', password='123qazwsx')

        def test_valid_user_login(self):
            header = {'Content-Type': 'application/json'}
            data =  {"username": "test_user","password": "123qazwsx"} #valid
            response = self.c.post('/api/obtain-auth-token/', data, format='json', **header)
            self.assertEqual(response.status_code, status.HTTP_200_OK, "REST User Token failed - "+str(response.status_code))
            self.assertEqual(Token.objects.count(), 1) # check if there is token created

        def test_invalid_user_login(self):
            header = {'Content-Type': 'application/json'}
            data =  {"username": "test_user","password": "123"} #invalid
            response = self.c.post('/api/obtain-auth-token/', data, format='json', **header)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "REST User Token failed - "+str(response.status_code))

