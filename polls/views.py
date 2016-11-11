from django.contrib.auth.models import User
from .models import Poll, Vote

from rest_framework import viewsets, response, permissions
from .serializers import PollSerializer, VoteSerializer

from .permissions import IsOwnerOrStaffElseReadonly

from rest_framework import filters

from django.db.models import Count
from rest_framework.exceptions import APIException
from rest_framework import status
import django_filters
import datetime

class PollFilter(filters.FilterSet):
    added_gte = django_filters.DateTimeFilter(name="added", lookup_expr='gte')
    class Meta:
        model = Poll
        fields = ['added','added_gte']


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all().order_by('-added')
    serializer_class = PollSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    # filter_fields = ('circle',)
    filter_class = PollFilter
    permission_classes = (IsOwnerOrStaffElseReadonly,)

    def retrieve(self, request, pk=None):
         query = Poll.objects.filter(id=pk)
         print(query.count())
         print("retrieving poll")
         if query.count() ==1:
             print("yes retrieving poll")
             poll = Poll.objects.get(id=pk)
             custom_data = {
                 'poll': PollSerializer(poll,context={'request':request}).data
             }
             selections=[]
             for restaurant in poll.restaurants.all():
                 selections.append(restaurant)
             selection_vote_counts = {}
             if len(selections) > 0:
                 for selection in selections:
                    selection_vote_counts[str(selection.name)] = list(poll.vote_set.filter(choice=selection.id).aggregate(Count('id')).values())[0]
             custom_data.update({
                 'vote_counts' : selection_vote_counts
             })
             try:
                 vote = Vote.objects.filter(foodie=request.user.foodie, poll=poll)
                 selected_restaurant = vote[0].choice.id
                 custom_data.update({
                 'user_selection' : [selected_restaurant]
                 })
             except:
                 custom_data.update({
                 'user_selection' : []
                 })
             return response.Response(custom_data)
         else:
             raise APIException("Poll not found")
             # print("no retrieving poll")
             # return response.Response(status.HTTP_404_NOT_FOUND)


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('foodie','poll','choice',)
    permission_classes = (IsOwnerOrStaffElseReadonly,)
