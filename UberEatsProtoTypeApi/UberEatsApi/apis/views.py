from decimal import Decimal

from django.db.models import Sum, F

from .models import Customer, Restaurant, Dish, Cart, Order, Favorite
from .serializers import CustomerSerializer, RestaurantSerializer, DishSerializer, CartSerializer, OrderSerializer, \
    CartItemSerializer, FavoriteSerializer
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
            if "delivery_time" in request.data:
                request.data["delivery_time"] = str(int(request.data["delivery_time"]) * 60)
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
        if 'profile_image' in request.data:
            restaurant.image = request.data['profile_image']
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


def update_cart_with_new_items(items, customer):
    cart_items = Cart.objects.filter(customer=customer, is_still_in_cart=True)
    if cart_items.count() > 0:
        restaurant_id = cart_items[0].restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)

    if not items:
        return Response({'message': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    if not cart_items.count() > 0:
        restaurant_id = Dish.objects.get(id=items[0]['dish_id']).restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)

    for item in items:
        #     check if item is in the cart
        if not Cart.objects.filter(dish_id=item['dish_id'], customer=customer, is_still_in_cart=True).exists():
            Cart.objects.create(customer=customer, dish=Dish.objects.get(id=item['dish_id']), restaurant=restaurant
                                , is_still_in_cart=True, quantity=item['quantity'])
        else:
            cart_item = Cart.objects.get(dish_id=item['dish_id'], customer=customer, is_still_in_cart=True)
            cart_item.quantity = item['quantity']
            cart_item.save()
    # delete the cart items which are not in the order
    # Extract dish_ids from request items
    requested_dish_ids = {item['dish_id'] for item in items}

    # Delete cart items not in requested_dish_ids
    Cart.objects.filter(customer=customer, is_still_in_cart=True).exclude(dish_id__in=requested_dish_ids).delete()


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_serializer_context(self):
        return {'request': self.request}
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
        cart_items_serializer = CartItemSerializer(cart_items, many=True, context={'request': request})
        cart_total_price = cart_items.aggregate(total_price=Sum(F('quantity') * F('dish__price')))
        return Response({'restaurant_id': cart_items[0].restaurant.user_id,
                         'restaurant_name': cart_items[0].restaurant.restaurant_name,
                         'cart_total_price': cart_total_price['total_price'], 'items': cart_items_serializer.data},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def add_to_cart(self, request):
        if not request.user.is_authenticated and not request.user.is_customer:
            return Response({'message': 'Please login to add items to cart'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = request.user.customer
        dish_id = request.data.get('dish_id')
        quantity = request.data.get('quantity', 1)

        dish = Dish.objects.get(id=dish_id)
        restaurant_id = dish.restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)

        cart_items_before_addition = Cart.objects.filter(customer=customer, is_still_in_cart=True)
        # // Flush the cart if items in cart with is_still_in_cart=True and is from different restaurant
        if cart_items_before_addition.exists() and cart_items_before_addition[0].restaurant != restaurant:
            Cart.objects.filter(customer=customer, is_still_in_cart=True).delete()



        if Cart.objects.filter(customer=customer, dish=dish, is_still_in_cart=True).exists():
            # Update the quantity of the existing cart item
            cart_item = Cart.objects.get(customer=customer, dish=dish, is_still_in_cart=True)
            cart_item.quantity += quantity
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
                cart_item.quantity = quantity
                cart_item.save()

            return Response({'message': 'Item added to cart'}, status=status.HTTP_200_OK)

    # Add a API to add multiple dishes in cart
    @action(detail=False, methods=['POST'])
    def add_multiple_to_cart(self, request):
        if not request.user.is_authenticated:
            return Response({'message': 'Please login to add items to cart'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = request.user.customer
        items = request.data.get('items', [])
        update_cart_with_new_items(items, customer)

        return Response({'message': 'Cart updated'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['DELETE'])
    def clear_cart(self, request):
        cart_items = Cart.objects.filter(customer=request.user.customer, is_still_in_cart=True)
        cart_items.delete()
        return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        ordered_items = Cart.objects.filter(order_history=instance.id, is_still_in_cart=False)
        ordered_items_data = [
            {
                'dish_id': item.dish.id,
                'dish_name': item.dish.dish_name,
                'dish_image': request.build_absolute_uri(item.dish.dish_image.url) if item.dish.dish_image else None,
                'quantity': item.quantity,
                'price': item.dish.price
            }
            for item in ordered_items
        ]
        data['ordered_items'] = ordered_items_data

        if request.user.is_authenticated and request.user.is_restaurant:
            # Add customer URL for restaurant users
            data['customer_url'] = request.build_absolute_uri(reverse('customer-detail', args=[data['customer']]))
            data['customer_name'] = Customer.objects.get(user_id=data['customer']).name

        elif request.user.is_authenticated and request.user.is_customer:
            # Add restaurant URL for customer users
            data['restaurant_url'] = request.build_absolute_uri(reverse('restaurant-detail', args=[data['restaurant']]))
            data['restaurant_name'] = Restaurant.objects.get(user_id=data['restaurant']).restaurant_name

        return Response(data)

    def list(self, request, **kwargs):
        if request.user.is_authenticated and request.user.is_customer:
            customer = request.user.customer
            orders = Order.objects.filter(customer=customer).order_by('-created_at')
            serializer = self.get_serializer(orders, many=True)
            for order in serializer.data:
                ordered_items = Cart.objects.filter(order_history=order["id"], is_still_in_cart=False)
                ordered_items_data = [
                    {
                        'dish_id': item.dish.id,
                        'dish_name': item.dish.dish_name,
                        'quantity': item.quantity,
                        'dish_image': request.build_absolute_uri(item.dish.dish_image.url) if item.dish.dish_image.url else None,
                        'price': item.dish.price
                    }
                    for item in ordered_items
                ]
                order['items'] = ordered_items_data
                # Build customer URL
                order['item_count'] = Cart.objects.filter(order_history=order['id']).count()
                order['restaurant_url'] = request.build_absolute_uri(
                    reverse('restaurant-detail', args=[order['restaurant']]))
                order['restaurant_name'] = Restaurant.objects.get(user_id=order['restaurant']).restaurant_name
            return Response(serializer.data)
        elif request.user.is_authenticated and request.user.is_restaurant:
            orders = Order.objects.filter(restaurant=request.user.restaurant).order_by('-created_at')
            serializer = self.get_serializer(orders, many=True)
            order_data = serializer.data
            for order in order_data:
                ordered_items = Cart.objects.filter(order_history=order["id"], is_still_in_cart=False)
                ordered_items_data = [
                    {
                        'dish_id': item.dish.id,
                        'dish_name': item.dish.dish_name,
                        'quantity': item.quantity,
                        'dish_image': request.build_absolute_uri(item.dish.dish_image.url) if item.dish.dish_image.url else None,
                        'price': item.dish.price
                    }
                    for item in ordered_items
                ]
                order['items'] = ordered_items_data
                # Build customer URL
                order['item_count'] = Cart.objects.filter(order_history=order['id']).count()
                order['customer_url'] = request.build_absolute_uri(reverse('customer-detail', args=[order['customer']]))
                order['customer_name'] = Customer.objects.get(user_id=order['customer']).name
            return Response(serializer.data)
        else:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['POST'])
    def place_order(self, request):
        if not request.user.is_authenticated and not request.user.is_customer:
            return Response({'message': 'Please login to place an order'}, status=status.HTTP_401_UNAUTHORIZED)

        customer = request.user.customer

        # Get cart items
        cart_items = Cart.objects.filter(customer=customer, is_still_in_cart=True)
        restaurant_id = cart_items[0].restaurant.user.id
        restaurant = Restaurant.objects.get(user_id=restaurant_id)

        update_cart_with_new_items(request.data.get('items'), customer)

        # Get delivery address
        cart_items = Cart.objects.filter(customer=customer, is_still_in_cart=True)
        # if delivery address is empty, return error
        if not request.data.get('delivery_address'):
            return Response({'message': 'Delivery address is required'}, status=status.HTTP_400_BAD_REQUEST)
        delivery_address = request.data.get('delivery_address')
        total_price = sum(Decimal(item.dish.price) * item.quantity for item in cart_items)
        order = Order.objects.create(
            customer=customer,
            restaurant=restaurant,
            total_price=total_price,
            delivery_address=delivery_address,
            status='New Order',
            special_notes=request.data.get('special_notes')
        )

        # Attach order_id to cart items and invalidate the items from the cart
        for cart_item in cart_items:
            cart_item.order_history = order
            cart_item.is_still_in_cart = False
            cart_item.save()

        return Response({'message': 'Order placed successfully', 'order_id': order.id, 'total_price': total_price, 'restaurant_name': restaurant.restaurant_name},
                        status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):

        if not request.user.is_authenticated or not request.user.is_restaurant:
            return Response({'error': 'Only restaurants can update orders'}, status=status.HTTP_403_FORBIDDEN)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Check if the restaurant owns this order
        if instance.restaurant.user != request.user:
            return Response({'error': 'You can only update orders for your restaurant'},
                            status=status.HTTP_403_FORBIDDEN)

        # Only allow updating the status field
        data = {'status': request.data.get('status')}
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if 'status' not in request.data:
            return Response({'error': 'Only status can be updated'}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        order_data = serializer.data
        order_data['customer_url'] = request.build_absolute_uri(
            reverse('customer-detail', args=[order_data['customer']]))
        return Response(order_data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


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
