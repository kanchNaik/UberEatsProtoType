from rest_framework import serializers
from .models import Cart, Customer, Favorite, Order, Restaurant, Dish, User


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['name', 'phone_number', 'city', 'state', 'country', 'profile_image', 'date_of_birth', 'nickname']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['restaurant_name', 'location', 'description', 'phone_number', 'rating', 'image', 'uberone',
                  'price_range', 'delivery_time']
        extra_kwargs = {
            'rating': {'required': False},
            'image': {'required': False},
        }


class UserSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(required=False)  # Allow for customer data
    restaurant = RestaurantSerializer(required=False)  # Allow for restaurant data

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_customer', 'is_restaurant', 'customer', 'restaurant', 'username']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print(validated_data)
        # Separate customer/restaurant data from user data
        customer_data = validated_data.pop('customer', None)
        restaurant_data = validated_data.pop('restaurant', None)

        # Create user
        user = User.objects.create_user(**validated_data)

        # Handle customer or restaurant creation based on user type
        if user.is_customer and customer_data:
            customer_instance = Customer.objects.create(user=user, **customer_data)
            user.customer = customer_instance  # Set the customer instance explicitly
        elif user.is_restaurant and restaurant_data:
            restaurant_instance = Restaurant.objects.create(user=user, **restaurant_data)
            user.restaurant = restaurant_instance  # Set the restaurant instance explicitly

        # Save user after assigning customer or restaurant
        user.save()

        return user


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'dish_name', 'description', 'price', 'category', 'restaurant', 'dish_image']


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ['customer', 'dish', 'quantity', 'added_at', 'restaurant', 'is_still_in_cart']


class CartItemSerializer(serializers.ModelSerializer):
    dish_id = serializers.IntegerField(source='dish.id')
    dish_name = serializers.CharField(source='dish.dish_name')
    dish_image = serializers.ImageField(source='dish.dish_image',use_url=True)
    description = serializers.CharField(source='dish.description')
    price = serializers.CharField(source='dish.price')
    category = serializers.CharField(source='dish.category')

    class Meta:
        model = Cart
        fields = ['dish_id', 'quantity', 'dish_name', 'description', 'price', 'category', 'dish_image']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'status', 'total_price', 'delivery_address', 'customer', 'restaurant', 'created_at',
                  'updated_at', 'special_notes']
        read_only_fields = ['id', 'total_price', 'delivery_address', 'customer', 'restaurant', 'created_at',
                            'updated_at', 'special_notes']


class FavoriteSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()
    class Meta:
        model = Favorite
        fields = ['customer', 'restaurant', 'created_at']
