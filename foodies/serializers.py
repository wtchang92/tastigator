from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Foodie, ProfileImage

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(allow_blank=False, write_only=True)
    confirm_pass = serializers.CharField(allow_blank=False, write_only=True)
    new_pass = serializers.CharField(allow_blank=True, write_only=True)
    new_confirm_pass = serializers.CharField(allow_blank=True, write_only=True)
    foodie_id = serializers.URLField(source='foodie.id', allow_blank=True, read_only=True)
    is_guide = serializers.BooleanField(source='foodie.is_guide', read_only=True )

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email','is_staff','confirm_pass','foodie_id', 'new_pass', 'new_confirm_pass','is_guide')
        write_only_fields = ('password','confirm_pass', 'new_pass', 'new_confirm_pass')
        read_only_fields = ('id','is_staff','foodie','is_guide')

    def create(self, validated_data):
        user = User.objects.filter(username=validated_data['username'])
        user2 = User.objects.filter(email=validated_data['email'])
        password1 = validated_data['password']
        password2 = validated_data['confirm_pass']
        if user:
            raise serializers.ValidationError("Username exist")
        elif user2:
            raise serializers.ValidationError("Email already registered")
        elif password1 and password1 != password2:
            raise serializers.ValidationError("Passwords don't match")
        else:
            validated_data['username'] = validated_data['username'].lower()
            validated_data['email'] = validated_data['email'].lower()

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    def update(self, instance, validated_data):
        if 'username' in validated_data:
                if validated_data['username'] != instance.username:
                    user = User.objects.filter(username=validated_data['username'])
                    if user:
                        raise serializers.ValidationError("Username exist")
        if 'email' in validated_data:
            if validated_data['email'] != instance.email:
                print("email ")
                email = User.objects.filter(email=validated_data['email'])
                if email:
                    print("email 1")
                    raise serializers.ValidationError("Email exist")

        if validated_data.keys() >= {'password','new_pass','new_confirm_pass'}:
            if validated_data["password"] or validated_data["new_pass"] or validated_data["new_confirm_pass"]:
                if (validated_data["password"] and validated_data["new_pass"] and validated_data["new_confirm_pass"]):
                    if instance.check_password(validated_data["password"]):
                        if validated_data["new_pass"] == validated_data["new_confirm_pass"]:
                            instance.set_password(validated_data["new_pass"])
                        else:
                            raise serializers.ValidationError("new password and new confirmation password do not match")
                    else:
                        raise serializers.ValidationError("Current password incorrect")
        elif validated_data.keys() & {'password','new_pass','new_confirm_pass'}:
            raise serializers.ValidationError("Missing required password field(s)")

        for attr, value in validated_data.items():
            if attr != "password" and attr != "new_pass" and attr != "new_confirm_pass":
                setattr(instance, attr, value)
            else:
                pass
        instance.save()
        return instance

class ProfileImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = '__all__'
        read_only_fields = ('added','updated','owner', 'url', 'datafile')
    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if ProfileImage.objects.filter(owner=user.foodie.id).count() > 0:
                print("deleting image object")
                ProfileImage.objects.filter(owner=user.foodie.id).delete()
        return ProfileImage.objects.create(**validated_data)

class FoodieSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer('user', read_only=True)
    profileimage = ProfileImageUploadSerializer('profileimage', read_only=True)
    class Meta:
        model = Foodie
        fields = ('id','url','is_guide','user','profileimage')
        read_only_fields = ('id','url')