from datetime import datetime
from decimal import Decimal

from django.db.models import Sum, F

from .models import Customer, Restaurant, Dish
from .serializers import CustomerSerializer, RestaurantSerializer, DishSerializer
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.urls import reverse


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'])
    def me(self, request):
        restaurant = Restaurant.objects.get(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(restaurant)
            restaurant_data = serializer.data
            restaurant_data['email'] = request.user.email
            return Response(restaurant_data)
        elif request.method in ['PUT', 'PATCH']:
            if "image" in request.data:
                del request.data["image"]
            if "delivery_time" in request.data:
                time_str = request.data["delivery_time"]
                try:
                    time_obj = datetime.strptime(time_str, '%H:%M:%S')
                    minutes = time_obj.hour * 60 + time_obj.minute
                    request.data["delivery_time"] = str(minutes)
                except ValueError:
                    return Response({'error': 'Invalid time format. Use HH:MM:SS.'},
                                    status=status.HTTP_400_BAD_REQUEST)
            serializer = self.get_serializer(restaurant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                restaurant_data = serializer.data
                restaurant_data['email'] = request.user.email
                return Response(restaurant_data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Add profile URL to each restaurant
        for restaurant, query in zip(serializer.data, queryset):
            restaurant_id = query.user_id
            restaurant['id'] = restaurant_id
            restaurant['profile_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[restaurant_id]))
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['profile_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[instance.user_id]))
        data['id'] = instance.user_id
        return Response(data)

    @action(detail=False, methods=['PUT'], url_path='profile-picture')
    def update_profile_picture(self, request):
        restaurant = Restaurant.objects.get(user=request.user)
        if 'image' in request.data:
            restaurant.image = request.data['image']
            restaurant.save()
            return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the dish
        return obj.restaurant.user == request.user


class DishViewSet(viewsets.ModelViewSet):
    serializer_class = DishSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Filter dishes by the restaurant of the authenticated user
        return Dish.objects.filter(restaurant__user=self.request.user)

    def perform_create(self, serializer):
        # Set the restaurant to the authenticated user's restaurant
        restaurant = Restaurant.objects.get(user=self.request.user)
        serializer.save(restaurant=restaurant)


class RestaurantDishesView(generics.ListAPIView):
    serializer_class = DishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.kwargs['restaurant_id']
        return Dish.objects.filter(restaurant_id=restaurant_id)
