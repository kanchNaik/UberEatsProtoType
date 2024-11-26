import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerOrderList.css'; // Add styling for the page
import Cookies from 'js-cookie';
import OrderCard from '../OrderCard'
import { NavLink } from 'react-router-dom';
import { BASE_API_URL } from '../../../Setupconstants';
import { messageService } from '../../Common/Message/MessageService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../actions';

const CustomerOrderList = () => {
    const token = useSelector((state) => state.auth.token);

    const dispatch = useDispatch();
    const { list: orders, error } = useSelector((state) => state.orders || { list: [], error: null });

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (error) {
        return <div className="error">Error fetching orders: {error}</div>;
    }

    return (
        <div className="orders-container">
            {orders.length > 0 ? (
                <>
                    {orders.map((order, index) => (
                        <NavLink to={`/orders/${order.id}`}>
                        <div className="" key={index}>
                           <OrderCard 
                            order={order}
                           />
                        </div>
                        </NavLink>
                    ))}
                </>
            ) : (
                <div className="no-orders">
                    <img src="no-orders-icon.png" alt="No Orders" className="no-orders-icon" />
                    <h2>No orders yet</h2>
                    <p>When you place your first order, it will appear here</p>
                </div>
            )}
        </div>
    );
};

export default CustomerOrderList;
