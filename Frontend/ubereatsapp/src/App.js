// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import './App.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Components/Home/Home';
import SignUp from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIn';
import RestaurantSignUp from './Components/SignUp/RestaurantSignUp';
import Feed from './Components/Feed/Feed';
import Restaurant from './Components/Restaurant/Restaurant';
import UserProfile from './Components/UserProfile/UserProfile';

import DynamicNavbar from './Components/Navbar/DynamicNavbar';
import Testpage from './Components/Testpage';
import RestaurantHome from './Components/Feed/RestaurantHome';
import RestaurantProfile from './Components/RestaurantProfile/RestaurantProfile';
import RestaurantDishesList from './Components/RestaurantDishes/RestaurantDishesList';
import DishAdd from './Components/RestaurantDishes/DishAdd';
import Checkout from './Components/Checkout/Checkout';
import { useDispatch } from 'react-redux';
import { fetchCartData } from './Components/Cart/FetchCustomerCart';
import CustomerOrderList from './Components/Order/CustomerOrderList/CustomerOrderList';
import CustomerOrder from './Components/Order/CustomerOrder/CustomerOrder'
import RestaurantOrderList from './Components/Order/RestaurantOrder/RestaurantOrderList/RestaurantOrderList';
import FavoriteRestaurants from './Components/FavoriteRestaurants/FavoriteRestaurants'
import CustomerProfile from './Components/UserProfile/CustomerProfile/CustomerProfile';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoutes';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

function App() {
const { isAuthenticated, userType, loading } = useAuth();

  const location = useLocation();
  
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch cart data when the app loads
    if (isAuthenticated && userType === 'customer') {
      fetchCartData(dispatch);
    }

    console.log("Auth state location:", location.pathname);
    console.log("Auth state updated:", { isAuthenticated, userType });
  }, [dispatch, isAuthenticated, userType]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state until authentication status is verified
  }

  return (
    <div className="App">
      <DynamicNavbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/merchantsignup" element={<RestaurantSignUp />} />
        <Route path="/test" element={<Testpage/>}/>

        <Route path="/feed" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}> <Feed /> </ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}> <Restaurant /> </ProtectedRoute>} />
        <Route path="/customer/me" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}> <UserProfile /> </ProtectedRoute>} />
        <Route path="/order/checkout" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}> <Checkout/> </ProtectedRoute>}/>
        <Route path="/orders" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}><CustomerOrderList /> </ProtectedRoute>}/>
        <Route path="/orders/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}><CustomerOrder /> </ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Customer" userType={userType}><FavoriteRestaurants/> </ProtectedRoute>}/>
        
       
        <Route path="/restaurant/home" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}> <RestaurantHome/> </ProtectedRoute>}/>
        <Route path="/restaurant/my" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}> <RestaurantProfile/> </ProtectedRoute>}/>
        <Route path="/restaurant/dishes" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}>  <RestaurantDishesList/> </ProtectedRoute>} />
        <Route path="/restaurant/dish/add" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}>  <DishAdd/> </ProtectedRoute>}/>
        <Route path="/restaurant/dish/edit/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}>  <DishAdd isEdit /> </ProtectedRoute>} />
        
        
        <Route path="/restaurant/orders" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}>  <RestaurantOrderList /> </ProtectedRoute>} />
        <Route path="/customers/profile/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} allowedUserType="Restaurant" userType={userType}>  <CustomerProfile /> </ProtectedRoute>}/>
      </Routes>
    </div>
  );
}

export default App;
