from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import CustomerViewSet, RestaurantViewSet, DishViewSet, RestaurantDishesView, CartViewSet
from .auth_views import SignUpView, LoginView, LogoutView

# Create a router to handle the viewsets
router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'dishes', DishViewSet, basename='dish')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('', include(router.urls)),

    path('restaurants/<int:restaurant_id>/dishes/', RestaurantDishesView.as_view(), name='restaurant-dishes'),

]
