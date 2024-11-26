from rest_framework.routers import DefaultRouter
from django.urls import include, path
from .views import CartViewSet, OrderViewSet

# Create a router to handle the viewsets
router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'order', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
