from django.contrib.auth.models import User
from .models import Poll, Vote

from rest_framework import viewsets, response, permissions
from .serializers import PollSerializer, VoteSerializer

from .permissions import IsOwnerOrStaffElseReadonly_Vote, IsPollOwnerOrStaffElseReadonly_Vote

from rest_framework import filters

from django.db.models import Count


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    # filter_fields = ('circle',)
    permission_classes = (permissions.IsAuthenticated,)
    def get_permissions(self):
        return (IsPollOwnerOrStaffElseReadonly_Vote() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),

    def retrieve(self, request, pk=None):
         poll = Poll.objects.get(id=pk)
         custom_data = {
             'poll': PollSerializer(poll,context={'request':request}).data
         }
         selections=[]
         for restaurant in poll.restaurants.all():
             selections.append(restaurant)
         selection_vote_counts = {}
         if len(selection_vote_counts) > 0:
             for selection in selections:
                selection_vote_counts[str(selection.name)] = poll.vote_set.filter(choice=selection.id).aggregate(Count('id')).values()[0]
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

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('foodie','poll','choice')
    permission_classes = (permissions.IsAuthenticated,)

    def get_permissions(self):
        return (IsOwnerOrStaffElseReadonly_Vote() if self.request.method not in permissions.SAFE_METHODS
                else permissions.IsAuthenticated()),