from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_restaurant = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Add related_name to avoid conflicts
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Add related_name to avoid conflicts
        blank=True
    )


class Customer(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    phone_number = models.CharField(max_length=20)
    nickname = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        profile_image_url = self.profile_image.url if self.profile_image else ''
        return f"{self.user.username} {self.nickname} {profile_image_url}"


class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    restaurant_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    phone_number = models.CharField(max_length=20)
    rating = models.IntegerField(null=True, blank=True)
    image = models.ImageField(upload_to='restaurant_images/', null=True, blank=True)
    price_range = models.TextField(null=True, blank=True)
    uberone = models.BooleanField(default=False)
    delivery_time = models.DurationField(null=True, blank=True)

    def __str__(self):
        return self.restaurant_name + " " + self.location

