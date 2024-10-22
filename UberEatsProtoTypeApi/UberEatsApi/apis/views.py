from decimal import Decimal

from .models import Customer, Restaurant, Dish, Cart, Order
from .serializers import CustomerSerializer, RestaurantSerializer, DishSerializer, CartSerializer, OrderSerializer, \
    CartItemSerializer
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
        for restaurant,query in zip(serializer.data,queryset):
            restaurant_id = query.user_id
            restaurant['id'] = restaurant_id
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



class RestaurantDishesView(generics.ListAPIView):
    serializer_class = DishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.kwargs['restaurant_id']
        return Dish.objects.filter(restaurant_id=restaurant_id)


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @action(detail=False, methods=['GET'])
    def get_cart(self, request):
        try:
            # Get the customer from the authenticated user
            customer = request.user.customer
        except Customer.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get all cart items for the customer
        cart_items = Cart.objects.filter(customer=customer, is_still_in_cart=True)

        if not cart_items:
            return Response({}, status=status.HTTP_200_OK)

        # Serialize the cart items
        cart_items_serializer = CartItemSerializer(cart_items, many=True)
        return Response({'restaurant_id': cart_items[0].restaurant.user_id, 'restaurant_name': cart_items[0].restaurant.restaurant_name, 'items': cart_items_serializer.data}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['POST'])
    def add_to_cart(self, request):
        if not request.user.is_authenticated and  not request.user.is_customer:
            return Response({'message': 'Please login to add items to cart'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = request.user.customer
        dish_id = request.data.get('dish_id')
        quantity = request.data.get('quantity', 1)

        dish = Dish.objects.get(id=dish_id)
        restaurant_id = dish.restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)
        if Cart.objects.filter(customer=customer, dish=dish, is_still_in_cart=True).exists():
            # Update the quantity of the existing cart item
            cart_item = Cart.objects.get(customer=customer, dish=dish, is_still_in_cart=True)
            cart_item.quantity = quantity
            cart_item.save()
            return Response({'message': 'Item updated in cart'}, status=status.HTTP_200_OK)
        else:
            # Create a new cart item if the dish is not present in the cart
            cart_item, created = Cart.objects.get_or_create(
                customer=customer,
                dish=dish,
                restaurant=restaurant,
                defaults={'quantity': quantity},
                is_still_in_cart=True
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            return Response({'message': 'Item added to cart'}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['DELETE'])
    def clear_cart(self, request):
        cart_items = Cart.objects.filter(customer=request.user.customer, is_still_in_cart=True)
        cart_items.delete()
        return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def list(self, request, **kwargs):
        if request.user.is_authenticated and  request.user.is_customer:
            customer = request.user.customer
            orders = Order.objects.filter(customer=customer).order_by('-created_at')
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        elif request.user.is_authenticated and  request.user.is_restaurant:
            orders = Order.objects.filter(restaurant=request.user.restaurant).order_by('-created_at')
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
    @action(detail=False, methods=['POST'])
    def place_order(self, request):
        if not request.user.is_authenticated and  not request.user.is_customer:
            return Response({'message': 'Please login to place an order'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = request.user.customer
        # Get cart items
        cart_items = Cart.objects.filter(customer=customer, is_still_in_cart=True)
        delivery_address = request.data.get('delivery_address')
        total_price = sum(Decimal(item.dish.price) * item.quantity for item in cart_items)
        restaurant_id = cart_items[0].restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)
        order = Order.objects.create(
            customer=customer,
            restaurant=restaurant,
            total_price=total_price,
            delivery_address=delivery_address,
            status='New Order'
        )

        # Attach order_id to cart items and invalidate the items from the cart
        for cart_item in cart_items:
            cart_item.order_history = order
            cart_item.is_still_in_cart = False
            cart_item.save()

        return Response({'message': 'Order placed successfully', 'order_id': order.id},
                        status=status.HTTP_201_CREATED)