from django.contrib.auth.models import User
from .models import Restaurant, Review, Thumb, Feedback

from rest_framework import viewsets, response, permissions
from .serializers import RestaurantSerializer, ReviewSerializer, ThumbSerializer, FeedbackSerializer

from .permissions import IsStaffOrTargetUser, IsOwnerOrStaffElseReadonly_Vote, Is_Guide_User

from rest_framework import filters
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Avg, Count

import django_filters

class RestaurantFilter(filters.FilterSet):
    added_gte = django_filters.DateTimeFilter(name="added", lookup_expr='gte')
    status=django_filters.CharFilter(name="status")
    class Meta:
        model = Restaurant
        fields = ['status','added','added_gte']

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.annotate(avg_review=Avg('review__score')).order_by('-added')
    serializer_class = RestaurantSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_class = RestaurantFilter
    pagination_class = LimitOffsetPagination
    ordering_fields = ('added', 'avg_review',)
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (Is_Guide_User() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),


class ReviewViewSet(viewsets.ModelViewSet):
    #/api/reviews/?ordering=score&limit=1&offset=0
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_fields = ('subject','restaurant','foodie',)
    pagination_class = LimitOffsetPagination
    ordering_fields = ('subject', 'added', 'score',)
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (IsOwnerOrStaffElseReadonly_Vote() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),


class ThumbViewSet(viewsets.ModelViewSet):
    #/api/reviews/?ordering=score&limit=1&offset=0
    queryset = Thumb.objects.all()
    serializer_class = ThumbSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_fields = ('up_or_down','restaurant',)
    pagination_class = LimitOffsetPagination
    permission_classes = (IsStaffOrTargetUser,)

class FeedbackViewSet(viewsets.ModelViewSet):
    #/api/reviews/?ordering=score&limit=1&offset=0
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_fields = ('review','foodie', 'added',)
    pagination_class = LimitOffsetPagination
    ordering_fields = ('score',)
    permission_classes = (IsStaffOrTargetUser,)
