import React, { useState } from 'react';
import './RestaurantOrderCard.css'; 
import { NavLink } from 'react-router-dom';
import { parseDate } from '../../Utilities/DateUtils';
import axios from 'axios';
import Cookies from 'js-cookie'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons'; 
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const RestaurantOrderCard = ({ order }) => {
    const [isEditing, setIsEditing] = useState(false); 
    const [newStatus, setNewStatus] = useState(order.status); 
    const [statusChanged, setStatusChanged] = useState(false); 

    const handleStatusSelect = (e) => {
        const updatedStatus = e.target.value;
        setNewStatus(updatedStatus);
        setStatusChanged(true);
    };


    const handleSaveStatus = async () => {
        try {
            await axios.put(
                `${BASE_API_URL}/api/order/${order.id}/`,
                { status: newStatus },
                {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    withCredentials: true,
                }
            );
            setIsEditing(false); 
            setStatusChanged(false); 
        } catch (error) {
            console.error('Failed to update status:', error);
            messageService.showMessage('error', 'Failed to update status')
        }
    };

    return (
        <div className="order-card">
            <div className="order-header">
                <NavLink to={`/customers/profile/${order.customer}`} className="customer-link">
                    <h3 className="restaurant-name">{order.customer_name}</h3>
                   
                    <FontAwesomeIcon icon={faLink} className="link-icon" />
                </NavLink>
                <img
                    src="partner-logo.png"
                    alt="Partner Logo"
                    className="partner-logo"
                />
            </div>

            <div className="order-details">
                <p className="order-info">
                    {parseDate(order.created_at)} • ${order.total_price} • {order.item_count} items • {newStatus}
                </p>
                <p>{order.delivery_address}</p>
            </div>

            <div className="button-container">
                
                <div className="edit-status">
                    {isEditing ? (
                        <>
                            <select
                                value={newStatus}
                                onChange={handleStatusSelect}
                                className="status-dropdown"
                            >
                                <option value="Order Received">Order Received</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="On the way">On the Way</option>
                                <option value="Pick up Ready">Pick up Ready</option>
                                <option value="Picked Up">Picked Up</option>
                            </select>

                            
                            <button
                                className="save-status-btn"
                                onClick={handleSaveStatus}
                            >
                                Save Status
                            </button>
                            <button
                                className="cancel-edit-btn"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button className="edit-status-btn" onClick={() => setIsEditing(true)}>
                            Edit Status
                        </button>
                    )}
                </div>

                <div className="orderDetails">
                    <NavLink to={`/orders/${order.id}`}>
                        <button className="view-order-btn">
                            View order
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default RestaurantOrderCard;
