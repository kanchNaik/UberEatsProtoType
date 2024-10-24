import React, { useState } from 'react';
import './RestaurantOrderCard.css'; // External CSS for styling
import { NavLink } from 'react-router-dom';
import { parseDate } from '../../Utilities/DateUtils';
import axios from 'axios';
import Cookies from 'js-cookie'; // Ensure you have this for CSRF token handling

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons'; // Link icon

const RestaurantOrderCard = ({ order }) => {
    const [isEditing, setIsEditing] = useState(false); // Track if status is being edited
    const [newStatus, setNewStatus] = useState(order.status); // Store the selected status
    const [statusChanged, setStatusChanged] = useState(false); // Track if the status has changed

    // Handle status selection (but don't update yet)
    const handleStatusSelect = (e) => {
        const updatedStatus = e.target.value;
        setNewStatus(updatedStatus);
        setStatusChanged(true); // Enable the Save button when a status is selected
    };

    // Handle status save and update the backend
    const handleSaveStatus = async () => {
        try {
            await axios.put(
                `http://localhost:8000/api/order/${order.id}/`,
                { status: newStatus },
                {
                    headers: {
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    withCredentials: true,
                }
            );
            setIsEditing(false); // Close editing mode after saving
            setStatusChanged(false); // Reset status changed flag
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="order-card">
            <div className="order-header">
                <NavLink to={`/customers/profile/${order.customer}`} className="customer-link">
                    <h3 className="restaurant-name">{order.customer_name}</h3>
                    {/* Font Awesome Link Icon */}
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
                {/* Edit Status Section */}
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

                            {/* Save Status Button */}
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
