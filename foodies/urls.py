from django.conf.urls import include, url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import UserViewSet,FoodieViewSet, ProfileImageViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'foodies', FoodieViewSet)
router.register(r'profile_images', ProfileImageViewSet)

urlpatterns = router.urls

urlpatterns += [
    url(r'^obtain-auth-token/$', csrf_exempt(obtain_auth_token)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))

]
