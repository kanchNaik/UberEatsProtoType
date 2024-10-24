import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantOrderList.css'; // Add styling for the page
import Cookies from 'js-cookie';
import RestaurantOrderCard from '../../RestaurantOrderCard';
import { NavLink } from 'react-router-dom';

const RestaurantOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All'); // Default filter is "All"

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
                setFilteredOrders(response.data); // Set the initial filtered orders to all orders
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Function to handle the filter change
    const handleStatusChange = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);

        if (status === 'All') {
            setFilteredOrders(orders); // Show all orders when "All" is selected
        } else {
            const filtered = orders.filter((order) => order.status === status);
            setFilteredOrders(filtered); // Update the filtered orders based on status
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error fetching orders</div>;
    }

    return (
        <div className='container'>
        <div className="filter-container">
                <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
                <select
                    id="status-filter"
                    className="status-filter"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                >
                    <option value="All">All</option>
                    <option value="Order Received">Order Received</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="On the way">On the Way</option>
                    <option value="Pick up Ready">Pick up Ready</option>
                    <option value="Picked Up">Picked Up</option>
                </select>
            </div>
        <div className="orders-container">
            {/* Status Filter */}
            

            {/* Display filtered orders */}
            {filteredOrders.length > 0 ? (
                <>
                    {filteredOrders.map((order, index) => (
                        <div className="" key={index}>
                            <RestaurantOrderCard 
                                order={order}
                            />
                        </div>
                    ))}
                </>
            ) : (
                <div className="no-orders">
                    <img src="no-orders-icon.png" alt="No Orders" className="no-orders-icon" />
                    <h2>No orders for the selected status</h2>
                    <p>Change the filter to view other orders.</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default RestaurantOrderList;
