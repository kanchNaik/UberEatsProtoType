import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerProfile.css'; // External CSS file for styling
import { useParams } from 'react-router-dom';
import { BASE_API_URL } from '../../../Setupconstants';
import { messageService } from '../../Common/Message/MessageService';
import { useSelector } from 'react-redux';

const CustomerProfile = () => {
    const [customer, setCustomer] = useState(null);
    const { id } = useParams();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/api/customers/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true // Sends cookies with the request
                });
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer:', error);
                messageService.showMessage('error', 'Error fetching customer')
            }
        };

        fetchCustomer();
    }, [id]);

    if (!customer) {
        return <div>Loading...</div>; // Loading state while fetching
    }

    return (
        <div className="customer-profile">
            <div className="profile-card">
                <h2 className="profile-title">Profile</h2>
                <div className="profile-row">
                    <span className="label">Name:</span>
                    <span className="value">{customer.name}</span>
                </div>
                <div className="profile-row">
                    <span className="label">Phone Number:</span>
                    <span className="value">{customer.phone_number}</span>
                </div>
                <div className="profile-row">
                    <span className="label">Country:</span>
                    <span className="value">{customer.country}</span>
                </div>
                <div className="profile-row">
                    <span className="label">State:</span>
                    <span className="value">{customer.state}</span>
                </div>
                <div className="profile-row">
                    <span className="label">City:</span>
                    <span className="value">{customer.city}</span>
                </div>
                <div className="profile-row">
                    <span className="label">Date of Birth:</span>
                    <span className="value">{new Date(customer.date_of_birth).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
