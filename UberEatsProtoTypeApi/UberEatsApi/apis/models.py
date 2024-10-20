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

# TODO : Add Restaurant Image model  
# class RestaurantImage(models.Model):
#     restaurant = models.ForeignKey(Restaurant, related_name='images', on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='restaurant_images/')
#     caption = models.CharField(max_length=100, blank=True)

class Dish(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, null=True, blank=True)
    dish_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.dish_name

# Seeting the foreign key on delete to NULL, because deleting a user should not delete order histiry of restaurant/cart
# Flush out the existing cart items for a user and replace them with the new ones
class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    dish = models.ForeignKey(Dish, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    order_history = models.ForeignKey('Order', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.user.username + " " + self.dish.dish_name
    
class Order(models.Model):
    STATUS_CHOICES = [
        ('Order Received','Order Received'),
        ('Preparing','Preparing'),
        ('On the way','On the way'),
        ('Pick up Ready','Pick up Ready'),
        ('Delivered','Delivered'),
        ('Picked Up','Picked Up'),
        ('Cancelled','Cancelled'),
        ('New Order','New Order'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New Order')
    total_price = models.DecimalField(max_digits=5, decimal_places=2)
    delivery_address = models.CharField(max_length=100)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id + ": " + self.status + " " + self.total_price + " " + self.delivery_address

class Favorite(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + " " + self.restaurant.restaurant_name


