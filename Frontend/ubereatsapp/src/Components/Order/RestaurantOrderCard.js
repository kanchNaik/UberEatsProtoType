import React, { useState } from 'react';
import './RestaurantOrderCard.css'; // External CSS for styling
import { NavLink } from 'react-router-dom';
import { parseDate } from '../../Utilities/DateUtils'
import axios from 'axios';

const RestaurantOrderCard = ({ order }) => {

    const [isEditing, setIsEditing] = useState(false); // Track if status is being edited
    const [newStatus, setNewStatus] = useState(order.status); // Store the selected status

    // Handle status change and update the backend
    const handleStatusChange = async (e) => {
        const updatedStatus = e.target.value;
        setNewStatus(updatedStatus);
        setIsEditing(false); // Close editing mode

        try {
            await axios.patch(
                `http://localhost:8000/api/order/${order.id}/`,
                { status: updatedStatus },
                { withCredentials: true } // Ensure cookies are sent
            );
            // // Trigger parent callback to reflect the new status if needed
            // if (onStatusUpdate) onStatusUpdate(order.id, updatedStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="order-card">
            <div className="order-header">
                <h3 className="restaurant-name">{order.customer_name}</h3>
                <img
                    src="partner-logo.png"
                    alt="Partner Logo"
                    className="partner-logo"
                />
            </div>

            <div className="order-details">
                <p className="order-info">
                    {parseDate(order.created_at)} • ${order.total_price} • {order.item_count} items • {order.status}
                </p>
                <p>
                    {order.delivery_address}
                </p>
            </div>

           
            <div><NavLink to={`/customers/${order.customer}`}>Go to Customer Profile</NavLink></div>

            {/* Edit Status Section */}
            <div className="edit-status">
                {isEditing ? (
                    <select
                        value={newStatus}
                        onChange={handleStatusChange}
                        className="status-dropdown"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                ) : (
                    <button
                        className="edit-status-btn"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Status
                    </button>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrderCard;
