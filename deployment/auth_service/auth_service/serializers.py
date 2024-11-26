from rest_framework import serializers
from .models import Customer, Restaurant, User


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['name', 'phone_number', 'city', 'state', 'country', 'profile_image', 'date_of_birth', 'nickname',
                  'profile_image']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['restaurant_name', 'location', 'description', 'phone_number', 'rating', 'image', 'uberone',
                  'price_range', 'delivery_time']


class UserSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(required=False)  # Allow for customer data
    restaurant = RestaurantSerializer(required=False)  # Allow for restaurant data

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'is_customer', 'is_restaurant', 'customer', 'restaurant', 'username']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Separate customer/restaurant data from user data
        customer_data = validated_data.pop('customer', None)
        restaurant_data = validated_data.pop('restaurant', None)

        # Create user
        user = User.objects.create_user(**validated_data)

        #send validated_data to restaurant microservice
        #send validated_data to customer microservice
        if user.is_customer and customer_data:
            #send api call to customer microservice



        # Handle customer or restaurant creation based on user type
        if user.is_customer and customer_data:
            Customer.objects.create(user=user, **customer_data)
        elif user.is_restaurant and restaurant_data:
            Restaurant.objects.create(user=user, **restaurant_data)

        return user
