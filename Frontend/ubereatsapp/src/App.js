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
import RestaurantHome from './Components/Feed/RestaurantHome'
import RestaurantProfile from './Components/RestaurantProfile/RestaurantProfile';
import RestaurantDishesList from './Components/RestaurantDishes/RestaurantDishesList'
import DishAdd from './Components/RestaurantDishes/DishAdd'




function App() {


  return (
    <div className="App">
      <DynamicNavbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/merchantsignup" element={<RestaurantSignUp />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/customer/my" element={<UserProfile />} />
        <Route path="/test" element={<Testpage/>}/>
        <Route path="/restaurant/home" element={<RestaurantHome/>}/>
        <Route path="/restaurant/my" element={<RestaurantProfile/>}/>
        <Route path="/restaurant/dishes" element={<RestaurantDishesList/>} />
        <Route path="/restaurant/dish/add" element={<DishAdd/>}/>
        <Route path="/restaurant/dish/edit/:id" element={<DishAdd isEdit />} />
      </Routes>
    </div>
  );
}

export default App;
