from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, CustomerSerializer, RestaurantSerializer
from .models import User, Customer, Restaurant
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Received data:", request.data)
        # Convert this minute string to second string by multiplying with 60 and theren convert it to string
        if "restaurant" in request.data:
            request.data["restaurant"]["delivery_time"] = str(int(request.data["restaurant"]["delivery_time"]) * 60)

        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print("Received data:", request.data)

        # Authenticate the user
        user = authenticate(username=username, password=password)

        print("authenticated user: ", user)  # Debugging output
        
        if user is not None:
            # login(request, user)  # Log the user in
            
            # If using token authentication, get or create a token
            # token, created = Token.objects.get_or_create(user=user)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            # Optionally return user data and token
            return Response({
                'message': 'Login successful',
                'token': access_token,  # Return the token
                'user': UserSerializer(user).data  # Return user data
            }, status=status.HTTP_200_OK)
        
        # If authentication fails
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("User:", request.user)
        print("User authenticated:", request.user.is_authenticated)  # Check if user is authenticated
        print("CSRF Token:", request.META.get('CSRF_COOKIE')) 
        logout(request)
        return Response({'message': 'Successfully logged out'})