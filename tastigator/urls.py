from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin

urlpatterns = [
    url(r'^app/', csrf_exempt(TemplateView.as_view(template_name='index.html'))),
    url(r'^api/', include('foodies.urls')),
    url(r'^admin/', include(admin.site.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#