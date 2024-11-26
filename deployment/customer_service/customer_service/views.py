from datetime import datetime
from decimal import Decimal

from django.db.models import Sum, F

from .models import Customer, Restaurant, Favorite
from .serializers import CustomerSerializer, FavoriteSerializer
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.urls import reverse


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'])
    def me(self, request):
        customer = Customer.objects.get(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(customer)
            customer_data = serializer.data
            customer_data['email'] = request.user.email
            return Response(customer_data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'])
    def profile(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = self.get_serializer(customer)
            customer_data = serializer.data
            customer_data['email'] = request.user.email
            return Response(customer_data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                customer_data = serializer.data
                customer_data['email'] = request.user.email
                return Response(customer_data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['PUT'], url_path='profile-picture')
    def update_profile_picture(self, request):
        customer = Customer.objects.get(user=request.user)
        if 'profile_image' in request.data:
            customer.profile_image = request.data['profile_image']
            customer.save()
            return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def list(self, request, **kwargs):
        if request.user.is_authenticated and request.user.is_customer:
            customer = request.user.customer
            favorites = Favorite.objects.filter(customer=customer)
            serializer = self.get_serializer(favorites, many=True)
            favorite_data = serializer.data
            for favorite, _favorite in zip(favorite_data, favorites):
                favorite['id'] = _favorite.id
                favorite['restaurant']['restaurant_id'] = _favorite.restaurant.user_id
                favorite['restaurant']['restaurant_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[_favorite.restaurant.user_id]))
            return Response(serializer.data)
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_customer:
            customer = request.user.customer
            restaurant = Restaurant.objects.get(user_id=request.data.get('restaurant_id'))
            favorite = Favorite.objects.create(
                customer=customer,
                restaurant=restaurant
            )
            serializer = self.get_serializer(favorite)
            favorite_data = serializer.data
            favorite_data['favorite_id'] = favorite.id
            favorite_data['restaurant']['restaurant_id'] = favorite.restaurant.user_id
            favorite_data['restaurant']['restaurant_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[favorite.restaurant.user_id]))
            return Response(favorite_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
