import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import { useSelector } from 'react-redux';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [specialNote, setSpecialNote] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const token = useSelector((state) => state.auth.token); // Access token directly

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/api/cart/get_cart`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setCart(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch cart data');
            messageService.showMessage('error', 'Failed to fetch cart data');
            setLoading(false);
        }
    };

    const handleQuantityChange = async (dishId, newQuantity) => {
        try {
            await axios.post(
                `${BASE_API_URL}/api/cart/add_multiple_to_cart/`,
                {
                    items: [{ dish_id: dishId, quantity: newQuantity }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            fetchCartData(); // Refresh cart data after updating
        } catch (error) {
            messageService.showMessage('error', 'Failed to update quantity');
        }
    };

    const handlePlaceOrder = async () => {
        if (!deliveryAddress) {
            messageService.showMessage('error', 'Please enter a delivery address');
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_API_URL}/api/order/place_order/`,
                {
                    delivery_address: deliveryAddress,
                    special_note: specialNote,
                    items: cart.items.map(item => ({
                        dish_id: item.dish_id,
                        quantity: item.quantity
                    }))
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            messageService.showMessage('success', 'Order placed successfully!');
            navigate('/feed');
        } catch (error) {
            messageService.showMessage('error', 'Failed to place order. Please try again.');
        }
    };

    if (loading) return <div>Loading cart...</div>;
    if (error) return <div>{error}</div>;
    if (!cart || !cart.items || cart.items.length === 0) return <div>Your cart is empty</div>;

    return (
        <div className="card">
            <div className="cart-summary">
                <h2>Cart summary ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</h2>
            </div>

            {cart.items.map((item) => (
                <div className="item-details" key={item.dish_id}>
                    <img src={item.dish_image} alt={item.dish_name} className="item-image" />
                    <div className="item-info">
                        <h3>{item.dish_name}</h3>
                        <p>{item.description}</p>
                        <div className="quantity-control">
                            <button onClick={() => handleQuantityChange(item.dish_id, Math.max(1, item.quantity - 1))}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.dish_id, item.quantity + 1)}>+</button>
                        </div>
                    </div>
                    <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}

            <div className="total">
                Total: ${cart.cart_total_price.toFixed(2)}
            </div>

            <div className="delivery-address-section">
                <label htmlFor="delivery-address">Delivery Address:</label>
                <input
                    type="text"
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="delivery-address-input"
                    required
                />
            </div>

            <div className="special-note-section">
                <label htmlFor="special-note">Special Note:</label>
                <textarea
                    id="special-note"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="Add a special note for your order (e.g., 'Leave at the door')"
                    rows="3"
                    className="special-note-input"
                />
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
                Place Order
            </button>
        </div>
    );
};

export default Checkout;