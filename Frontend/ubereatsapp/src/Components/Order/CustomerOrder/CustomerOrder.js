import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CustomerOrder.css'; // External CSS file for styles
import { useParams } from 'react-router-dom';
import { parseDate } from '../../../Utilities/DateUtils'
import { BASE_API_URL } from '../../../Setupconstants';
import { messageService } from '../../Common/Message/MessageService';

const CustomerOrder = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null); // State to store order details
    const [error, setError] = useState(null); // State for error handling
    const { id } = useParams();

    // Fetch order details using the provided API
    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/api/order/${id}/`, {
                withCredentials: true, // Enable sending cookies with the request
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
                },
            });
            setOrderDetails(response.data); // Update state with fetched order details
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to load order details. Please try again.');
            messageService.showMessage('error', 'Failed to load order details. Please try again.')
        }
    };

    // Fetch order details when component mounts or when the orderId changes
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Render order details or loading/error messages
    return (
        <div className="order-details-card">
            {error && <p className="error-message">{error}</p>} {/* Display error if any */}

            {!orderDetails ? (
                <p>Loading order details...</p> // Show loading message
            ) : (
                <>
                    <h4>Order #{orderDetails.id}</h4>
                    <h2>{orderDetails.restaurant_name}</h2>
                    <p>{parseDate(orderDetails.created_at)}</p>
                    <p><strong>Delivery Address:</strong> {orderDetails.delivery_address}</p>
                    <p><strong>Special Note:</strong> {orderDetails.special_note || 'None'}</p>

                    <div className="order-items">
                        <h3>Items</h3>
                        {orderDetails.ordered_items.map((item, index) => (
                           <div key={index} className="order-item">
                           <img src={item.dish_image || 'default-image.png'} alt={item.name} className="order-image" />
                           <div className="order-item-info">
                               <h4>{item.dish_name}</h4>
                               <p>Qty: {item.quantity}</p>
                               <p className="order-price">${item.price}</p>
                           </div>
                       </div>
                        ))}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <p><strong>Subtotal:</strong> ${orderDetails.total_price}</p>
                        <h4>Total: ${orderDetails.total_price}</h4>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerOrder;
