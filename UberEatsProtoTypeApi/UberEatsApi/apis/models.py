from djongo import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_restaurant = models.BooleanField(default=False)
    id = models.AutoField(primary_key=True)
    class Meta:
        indexes = [
            models.Index(fields=['username']),  # Create an index for 'username'
        ]

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    nickname = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    profile_image = models.ImageField(upload_to='profile_images/', null=True)

    def __str__(self):
        profile_image_url = self.profile_image.url if self.profile_image else ''
        return f"{self.user.username} {self.nickname} {profile_image_url}"

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    restaurant_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    phone_number = models.CharField(max_length=20)
    rating = models.IntegerField()
    image = models.ImageField(upload_to='restaurant_images/')
    price_range = models.TextField()
    uberone = models.BooleanField(default=False)
    delivery_time = models.DurationField()

    def __str__(self):
        return f"{self.restaurant_name} {self.location}"

class Dish(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    dish_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    category = models.CharField(max_length=100)
    dish_image = models.ImageField(upload_to='dish_images/')

    def __str__(self):
        return self.dish_name

class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    is_still_in_cart = models.BooleanField(default=True)
    order_history = models.ForeignKey('Order', on_delete=models.CASCADE, null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.customer.user.username} {self.dish.dish_name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('Order Received', 'Order Received'),
        ('Preparing', 'Preparing'),
        ('On the way', 'On the way'),
        ('Pick up Ready', 'Pick up Ready'),
        ('Delivered', 'Delivered'),
        ('Picked Up', 'Picked Up'),
        ('Cancelled', 'Cancelled'),
        ('New Order', 'New Order'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='New Order')
    total_price = models.DecimalField(max_digits=5, decimal_places=2)
    delivery_address = models.CharField(max_length=100)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    special_notes = models.TextField()

    def __str__(self):
        return f"{self.id}: {self.status} {self.total_price} {self.delivery_address}"

class Favorite(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.user.username} {self.restaurant.restaurant_name}"