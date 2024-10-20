from .models import Customer, Restaurant, Dish
from .serializers import CustomerSerializer, RestaurantSerializer, DishSerializer
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
        print("Received cookies:", request.cookies)
        print("Received CSRF token:", request.headers.get('X-CSRFToken'))
        customer = Customer.objects.get(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(customer)
            return Response(serializer.data)
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
            return Response(serializer.data)

        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['PUT'], url_path='profile-picture')
    def update_profile_picture(self, request):
        customer = Customer.objects.get(user=request.user)
        if 'profile_image' in request.data:
            customer.profile_image = request.data['profile_image']
            customer.save()
            return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'])
    def me(self, request):
        restaurant = Restaurant.objects.get(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(restaurant)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(restaurant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Add profile URL to each restaurant
        for restaurant,query in zip(serializer.data,queryset):
            restaurant_id = query.user_id
            restaurant['profile_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[restaurant_id]))

        return Response(serializer.data)


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


class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=False)
    
        # Add profile URL to each restaurant
        for restaurant, rest_obj in zip(serializer.data, queryset):
            restaurant_id = rest_obj['id']
            restaurant['profile_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[restaurant_id]))
    
        return Response(serializer.data)