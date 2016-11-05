from django.contrib.auth.models import User
from .models import Restaurant, Review

from rest_framework import viewsets, response, permissions
from .serializers import RestaurantSerializer, ReviewSerializer

from rest_framework.permissions import AllowAny
from .permissions import IsOwnerOrStaffElseReadonly_Vote, Is_Guide_User, IsPollOwnerOrStaffElseReadonly_Vote

from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status

from django.db.models import Avg, Count

import sys



class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter)
    pagination_class = LimitOffsetPagination
    ordering_fields = ('added', 'avg_review')
    # permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (Is_Guide_User() if self.request == "POST" or self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),

    def get_queryset(self):
        return Restaurant.objects.annotate(
            avg_review=Avg('review__score')
        )

    # def retrieve(self, request, pk=None):
    #     restaurant = Restaurant.objects.get(id=pk)
    #     custom_data = {
    #         'restaurant': RestaurantSerializer(restaurant,context={'request':request}).data
    #     }
    #     avg_score = 0
    #
    #     # try:
    #     try:
    #         calculated_avg = restaurant.review_set.aggregate(Avg('score'))
    #         if calculated_avg:
    #             avg_score = format(calculated_avg['score__avg'], '.2f')
    #     except:
    #         pass
    #     custom_data.update({
    #         'average_score' : avg_score
    #     })
    #     return response.Response(custom_data)


class ReviewViewSet(viewsets.ModelViewSet):
    #/api/reviews/?ordering=score&limit=1&offset=0
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter)
    filter_fields = ('subject','restaurant','foodie')
    pagination_class = LimitOffsetPagination
    ordering_fields = ('subject', 'added', 'score')
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (IsOwnerOrStaffElseReadonly_Vote() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),
