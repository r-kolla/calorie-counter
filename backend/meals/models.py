from django.db import models

# Create your models here.


class Meal(models.Model):
    image = models.ImageField(upload_to='meal_images/')
    food_name = models.CharField(max_length=255, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carbs = models.FloatField(null=True, blank=True)
    fat = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.food_name or "Unnamed Meal"
