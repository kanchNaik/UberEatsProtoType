from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import CustomerViewSet, RestaurantViewSet
from .auth_views import  SignUpView, LoginView, LogoutView



# Create a router to handle the viewsets
router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'restaurants', RestaurantViewSet, basename='restaurants')

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]