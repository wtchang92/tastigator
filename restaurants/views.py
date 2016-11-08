from django.contrib.auth.models import User
from .models import Restaurant, Review

from rest_framework import viewsets, response, permissions
from .serializers import RestaurantSerializer, ReviewSerializer

from .permissions import IsOwnerOrStaffElseReadonly_Vote, Is_Guide_User

from rest_framework import filters
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Avg


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter)
    pagination_class = LimitOffsetPagination
    ordering_fields = ('added', 'avg_review')
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (Is_Guide_User() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),

    def get_queryset(self):
        return Restaurant.objects.annotate(
            avg_review=Avg('review__score')
        )

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
