import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerOrderList.css'; // Add styling for the page
import Cookies from 'js-cookie';
import OrderCard from '../OrderCard'
import { NavLink } from 'react-router-dom';

const CustomerOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch the order list from the API
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/order/', {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken'),
                      },

                    withCredentials: true, // Include cookies in request
                });
                setOrders(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error fetching orders</div>;
    }

    return (
        <div className="order-list">
            {orders.length > 0 ? (
                <ul>
                    {orders.map((order, index) => (
                        <NavLink to={`/orders/${order.id}`}>
                        <li key={index}>
                           <OrderCard 
                            order={order}
                           />
                        </li>
                        </NavLink>
                    ))}
                </ul>
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
