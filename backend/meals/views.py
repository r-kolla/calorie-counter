from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework import generics

from .models import Meal

from .serializers import MealImageUploadSerializer, MealSerializer
from .clarifai_utils import get_food_tags_from_bytes
from .edamam_utils import get_nutrition_from_parser


class MealImageUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # Expect 'image' file in request.FILES
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Read bytes from image
        image_bytes = image_file.read()

        # Get food tags from Clarifai
        try:
            food_tags = get_food_tags_from_bytes(image_bytes)
            if not food_tags:
                return Response({"error": "No food tags detected."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Clarifai error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # For simplicity, just take the first detected food for nutrition lookup
        food_name = food_tags[0]

        # Get nutrition info from Edamam
        try:
            nutrition = get_nutrition_from_parser(food_name)
            if nutrition is None:
                return Response({"error": "Nutrition info not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Edamam error", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save meal record in DB
        meal = Meal.objects.create(
            image=image_file,  # assuming your Meal model has ImageField
            food_name=", ".join(food_tags),
            calories=nutrition.get("calories", 0),
            protein=nutrition.get("protein", 0),
            carbs=nutrition.get("carbs", 0),
            fat=nutrition.get("fat", 0)
        )

        serializer = MealSerializer(meal)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MealListAPIView(generics.ListAPIView):
    queryset = Meal.objects.all().order_by('-created_at')
    serializer_class = MealSerializer