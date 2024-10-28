import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css'; 
import Cookies from 'js-cookie';
import { useNavigate  } from 'react-router-dom';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const Checkout = () => {
    const navigate = useNavigate()

    // State to store cart details
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [specialNote, setSpecialNote] = useState(''); 
    const [deliveryAdd, setDeliveryAddress] = useState('');

    // Fetch cart data when component loads
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/api/cart/get_cart`,  {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    withCredentials: true, // Ensure that cookies are included in the request
                });
                setCart(response.data);
                setLoading(false);
                console.log('cart',cart)
            } catch (err) {
                setError('Failed to fetch cart data');
                messageService.showMessage('Failed to fetch cart data')
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const handlePlaceOrder = async () => {
        const formattedItems = cart.items.map((item) => ({
            dish_id: item.dish_id,
            quantity: item.quantity || 1, // Get the quantity or default to 1
          }));

        try {
            const response = await axios.post(
                `${BASE_API_URL}/api/order/place_order/`,
                {
                    delivery_address: {deliveryAdd},
                    special_note: {specialNote},
                    items: formattedItems,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'), // Get CSRF token from cookies
                    },
                    withCredentials: true, // Enable sending cookies with the request
                }
            );

            
            messageService.showMessage('success', 'Order placed successfully!')
            navigate('/feed')
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Failed to place order. Please try again.'); // Set error message
            messageService.showMessage('error', 'Failed to place order. Please try again.')
        }
    };

    // Handle special note input change
    const handleNoteChange = (e) => {
        setSpecialNote(e.target.value);
    };

    const handleAddressChange = (e) => {
        setDeliveryAddress(e.target.value);
    };


    // Display loading message while fetching data
    if (loading) {
        return <div>Loading cart...</div>;
    }

    // Display error message if something goes wrong
    if (error) {
        return <div>{error}</div>;
    }

    debugger;
    if((cart) => Object.keys(cart).length === 0)
    {
        return <div></div>
    }
    return (
        
        <div className="card">
            <div className="cart-summary">
                <h2>Cart summary ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</h2>
            </div>

            {/* Map through cart items */}
            {cart.items.map((item, index) => (
                <div className="item-details" key={index}>
                    <img src="pad-thai.jpg" alt={item.dish_name} className="item-image" />
                    <div className="item-info">
                        <h3>{item.dish_name} * {item.quantity}</h3>
                        <p>{item.description}</p>
                    </div>
                    <p className="price">${item.price}</p>
                </div>
            ))}

            <div className="promo-section">
                <a href="#">Add promo code</a>
            </div>
            
            <div className="order-total">
                <div className="total-row">
                    <span>Subtotal</span>
                    <span>${cart.cart_total_price}</span>
                </div>
            </div>

            <div className="total">
                Total: ${cart.cart_total_price}
            </div>

            {/* Special Note Section */}
            <div className="special-note-section">
                <label htmlFor="special-note">Special Note:</label>
                <textarea
                    id="special-note"
                    value={specialNote}
                    onChange={handleNoteChange}
                    placeholder="Add a special note for your order (e.g., 'Leave at the door')"
                    rows="3"
                    className="special-note-input"
                />
            </div>
            <div className="delivery-address-section">
                <label htmlFor="delivery-address">Delivery Address:</label>
                <textarea
                    id="delivery-address"
                    value={deliveryAdd}
                    onChange={handleAddressChange}
                    placeholder="Add a address for your order"
                    rows="3"
                    className="delivery-address-input"
                />
            </div>
            <button className="place-order-btn" onClick={handlePlaceOrder}>
                Place Order
            </button>

            <div className="footer-text">
                If you're not around when the delivery person arrives, they'll leave the food at your door.
            </div>
        </div>
    );
};

export default Checkout;
