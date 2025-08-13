from rest_framework import serializers
from .models import Meal

class MealSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Meal
        fields = '__all__'

    def get_image(self, obj):
        if obj.image:
            return obj.image.url if hasattr(obj.image, 'url') else obj.image
        return None



class MealImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()