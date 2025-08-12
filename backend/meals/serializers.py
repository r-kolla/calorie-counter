from rest_framework import serializers
from .models import Meal

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'



class MealImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()