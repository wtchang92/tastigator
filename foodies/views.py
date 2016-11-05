from django.contrib.auth.models import User
from .models import Foodie, ProfileImage

from rest_framework import viewsets, response, permissions
from .serializers import UserSerializer, FoodieSerializer, ProfileImageUploadSerializer

from rest_framework.permissions import AllowAny
from .permissions import IsStaffOrTargetUser, IsImageOwnerOrStaffElseReadonly

from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status

from django.db.models import Avg, Count


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),

    def list(self, request, *args, **kwargs):
        if request.method == 'GET' and 'username_starts' in request.GET:
            print("filtering on username test")
            username_starts = request.GET.get('username_starts')
            if username_starts is not None and username_starts != '':
                queryset = User.objects.filter(username__startswith=(username_starts))
                serializer = UserSerializer(queryset, many=True)
                return response.Response(serializer.data)
        else:
            return super(UserViewSet, self).list(request)

    def retrieve(self, request, pk=None):
        if pk == 'i':
            return response.Response(UserSerializer(request.user,
                context={'request':request}).data)
        return super(UserViewSet, self).retrieve(request, pk)

    def perform_update(self, serializer):
        serializer.save()
        return response.Response(serializer.data)

class FoodieViewSet(viewsets.ModelViewSet):
    queryset = Foodie.objects.all()
    serializer_class = FoodieSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (IsStaffOrTargetUser() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),


class ProfileImageViewSet(viewsets.ModelViewSet):
    queryset = ProfileImage.objects.all()
    serializer_class = ProfileImageUploadSerializer
    parser_classes = (MultiPartParser, FormParser,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (IsImageOwnerOrStaffElseReadonly() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),

    def perform_create(self, serializer):
        print("uploading image")
        print(self.request.data.get('datafile'))
        print(self.request.FILES)
        print(self.request.FILES['image'])
        serializer.save(owner=self.request.user.foodie,
                       datafile=self.request.FILES['image'])