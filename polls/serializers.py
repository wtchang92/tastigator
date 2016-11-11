from rest_framework import serializers
from foodies.models import Foodie
from restaurants.models import Restaurant
from .models import Poll, Vote

from foodies.serializers import FoodieSerializer
from restaurants.serializers import RestaurantSerializer


class PollSerializer(serializers.ModelSerializer):
    creator = FoodieSerializer('foodie', read_only=True)
    # choices = Restaurant.objects.all()
    # # choice_ids = [(choice.id,choice) for choice in choices]
    # # print("# of choices: %d" %len(choice_ids))
    restaurants = RestaurantSerializer('restaurants',many=True, read_only=True)
    restaurant_choices = serializers.ListField(
        child=serializers.IntegerField(max_value=None, min_value=None), write_only=True
    )
    # serializers.MultipleChoiceField(choice_ids, write_only=True)

    class Meta:
        model = Poll
        fields = ('id','url','title','description','restaurant_choices','creator','restaurants','status','added')
        read_only_fields = ('id','url','added','creator','status','restaurants')

    def create(self, validated_data):
        # print(validated_data['restaurants'])
        # print(type(validated_data['restaurants']))
        validated_data['creator'] = self.context['request'].user.foodie
        poll = Poll.objects.create(
            creator=self.context['request'].user.foodie,
            title = validated_data['title'],
            description = validated_data['description']
        )
        poll.save()
        for choice_id in validated_data['restaurant_choices']:
            if Restaurant.objects.filter(id=choice_id).count() == 1:
                poll.restaurants.add(Restaurant.objects.get(id=choice_id))
            else:
                raise serializers.ValidationError("Restaurant choice is not valid")
        return poll

    def validate(self, attr):
        if len(attr['restaurant_choices']) <= 0:
            raise serializers.ValidationError("Must enter at least 1 choice")
        return attr


class VoteSerializer(serializers.ModelSerializer):
    foodie = FoodieSerializer('foodie', read_only=True)
    choice_info = RestaurantSerializer('choice', read_only=True)


    class Meta:
        model = Vote
        fields = ('id','url','choice','foodie','poll','choice_info')
        read_only_fields = ('id','url','foodie','choice_info')

    def create(self, validated_data):
        vote = Vote.objects.create(
            foodie=self.context['request'].user.foodie,
            choice=validated_data['choice'],
            poll=validated_data['poll'],
        )
        vote.save()
        return vote

    def update(self, instance, validated_data):
        instance.foodie = validated_data.get('foodie', instance.foodie)
        instance.choice = validated_data.get('choice', instance.choice)
        instance.poll = validated_data.get('poll', instance.poll)
        instance.save()
        return instance