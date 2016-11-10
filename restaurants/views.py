from django.contrib.auth.models import User
from .models import Restaurant, Review, Thumb, Feedback

from rest_framework import viewsets, response, permissions
from .serializers import RestaurantSerializer, ReviewSerializer, ThumbSerializer, FeedbackSerializer

from .permissions import IsStaffOrTargetUser, IsOwnerOrStaffElseReadonly_Vote, Is_Guide_User

from rest_framework import filters
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Avg, Count


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_fields = ('status',)
    pagination_class = LimitOffsetPagination
    ordering_fields = ('added', 'avg_review',)
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (Is_Guide_User() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),

    def get_queryset(self):
        return Restaurant.objects.annotate(
            avg_review=Avg('review__score'))

    def list(self, request, *args, **kwargs):
        if request.method == 'GET' and 'thumb_downs_order' in request.GET:
            print("ordering thumb downs")
            thumb_downs_order = request.GET.get('thumb_downs_order')
            if thumb_downs_order is not None:
                if thumb_downs_order == 'asc':
                    queryset = Restaurant.objects.annotate(thumbs=Count('thumb')).order_by('thumbs')
                elif thumb_downs_order == 'desc':
                    queryset = Restaurant.objects.annotate(thumbs=Count('thumb')).order_by('-thumbs')
                serializer = RestaurantSerializer(queryset, many=True, context={'request': request})
                return response.Response(serializer.data)
        return super(RestaurantViewSet, self).list(request)


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
