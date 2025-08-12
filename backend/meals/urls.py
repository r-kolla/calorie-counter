from django.urls import path
from .views import MealImageUploadView, MealListAPIView




urlpatterns = [
    path('upload-meal-image/', MealImageUploadView.as_view(), name='upload-meal-image'),
    path('meals/', MealListAPIView.as_view(), name='meals-list-create'),
]