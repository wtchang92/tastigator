from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from foodies.views import UserViewSet,FoodieViewSet, ProfileImageViewSet
from restaurants.views import RestaurantViewSet,ReviewViewSet, ThumbViewSet, FeedbackViewSet
from polls.views import PollViewSet, VoteViewSet

from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view
from django .contrib.auth import views as auth_views

schema_view = get_swagger_view(title='Tastigator API')

router = DefaultRouter()

# foodies api
router.register(r'users', UserViewSet)
router.register(r'foodies', FoodieViewSet)
router.register(r'profile_images', ProfileImageViewSet)

#restaurants api
router.register(r'restaurants', RestaurantViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'thumbs', ThumbViewSet)
router.register(r'feedbacks', FeedbackViewSet)

#polls api
router.register(r'polls', PollViewSet)
router.register(r'votes', VoteViewSet)

api_urlpatterns = router.urls

#DRF admin
api_urlpatterns += [
    url(r'^obtain-auth-token/$', csrf_exempt(obtain_auth_token)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns = [
    url(r'^app/', csrf_exempt(TemplateView.as_view(template_name='index.html'))),
    url(r'^api/', include(api_urlpatterns)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', auth_views.login,),
    url(r'^docs/', schema_view),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#