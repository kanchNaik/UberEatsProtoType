import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css'; // External CSS file for styles
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
    const [specialNote, setSpecialNote] = useState(''); // State to store special note
    const [successMessage, setSuccessMessage] = useState(''); 

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
            } catch (err) {
                setError('Failed to fetch cart data');
                messageService.showMessage('Failed to fetch cart data')
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const handlePlaceOrder = async () => {
        debugger
        const formattedItems = cart.items.map((item) => ({
            dish_id: item.dish_id, // Assuming item.id is the dish ID
            quantity: item.quantity || 1, // Get the quantity or default to 1
          }));

        try {
            const response = await axios.post(
                `${BASE_API_URL}/api/order/place_order/`,
                {
                    delivery_address: 'Sunnyvale, CA, USA',
                    special_note: 'leave at door',
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

            // Assuming the response contains a success message or order details
            setSuccessMessage('Order placed successfully!'); // Set success message
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


    // Display loading message while fetching data
    if (loading) {
        return <div>Loading cart...</div>;
    }

    // Display error message if something goes wrong
    if (error) {
        return <div>{error}</div>;
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
                        <h3>{item.dish_name}</h3>
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
