from rest_framework import serializers, status
from foodies.models import Foodie
from .models import Restaurant, Review, Thumb, Feedback

from foodies.serializers import FoodieSerializer

import googlemaps
from .api_keys import google_api_key
"""
Please create a file named api_key.py in the restaurant app folder
and assign add the following to the file:

google_api_key = "your api key"

"""

class RestaurantSerializer(serializers.HyperlinkedModelSerializer):
    lat = None
    log = None
    avg_review = serializers.DecimalField(max_digits=4, decimal_places=2, read_only=True)
    thumb_downs = serializers.ReadOnlyField()
    score_average = serializers.ReadOnlyField()
    class Meta:
        model = Restaurant
        fields = ('id','url','added', 'name', 'description', 'street','city','state','avg_review','lat', 'log', 'status','thumb_downs','score_average')
        read_only_fields = ('id','url','added','review_average','avg_review', 'lat', 'log','thumb_downs','score_average')

    def create(self, validated_data):
        gmaps = googlemaps.Client(key=google_api_key)
        try:
            # address = str(data['street'].encode('ascii','ignore')) +  str(data['city'].encode('ascii','ignore')) +  str(data['state'].encode('ascii','ignore'))
            address = (validated_data['street'])+ ' ' +  (validated_data['city']) + ' '+ (validated_data['state'])
        except:
            address = validated_data['street']
        # Geocoding an address
        if not isinstance(address, str):
            geocode_result = gmaps.geocode(address)
        else:
            geocode_result = gmaps.geocode(address)

        if not geocode_result:
            raise serializers.ValidationError("invalid address & location not found")
        else:
            result = geocode_result[0]
            self.log = result['geometry']['location']['lng']
            self.lat = result['geometry']['location']['lat']

        restaurant = Restaurant.objects.create(
            name=validated_data['name'],
            description=validated_data['description'],
            street=validated_data['street'],
            city=validated_data['city'],
            state=validated_data['state'],
            lat= self.lat,
            log=self.log,
        )

        restaurant.save()

        return restaurant


class ReviewSerializer(serializers.ModelSerializer):
    foodie = FoodieSerializer('foodie', read_only=True)
    restaurant_name = serializers.ReadOnlyField(source="restaurant.name")
    class Meta:
        model = Review
        fields = ('id','url','foodie','restaurant_name', 'subject','restaurant','score','comment','added')
        read_only_fields = ('id','foodie','url','added')

    def create(self, validated_data):

        review = Review.objects.create(
            foodie=self.context['request'].user.foodie,
            subject=validated_data['subject'],
            restaurant=validated_data['restaurant'],
            score=validated_data['score'],
            comment=validated_data['comment'],
        )
        review.save()
        return review

    def validate(self, data):
        if data["restaurant"].status != 'visited':
            raise serializers.ValidationError("restaurant has not been visited")
        return super(ReviewSerializer, self).validate(data)


class ThumbSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thumb
        fields = ('id','url', 'restaurant', 'up_or_down','foodie')
        read_only_fields = ('id','url','foodie',)

    def create(self, validated_data):
        existing_check = Thumb.objects.filter(foodie=self.context['request'].user.foodie,
                                restaurant=validated_data['restaurant']).count()
        if existing_check != 0:
            raise serializers.ValidationError("User has already thumbed for the restaurant.")
        validated_data['foodie'] = self.context['request'].user.foodie
        return super(ThumbSerializer, self).create(validated_data)

class FeedbackSerializer(serializers.ModelSerializer):
    foodie_name = serializers.ReadOnlyField(source='foodie.user.username')
    class Meta:
        model = Feedback
        fields = ('id','url','added', 'review','foodie','message','foodie_name')
        read_only_fields = ('id','url','added','foodie','foodie_name')

    def create(self, validated_data):
        validated_data['foodie'] = self.context['request'].user.foodie
        return super(FeedbackSerializer, self).create(validated_data)