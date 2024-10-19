// CartIcon.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './CartIcon.css'; // Optional: Add custom styles

const CartIcon = ({ itemCount = 0 }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Shopping Cart Icon */}
      <FontAwesomeIcon icon={faShoppingCart} size="2x" />

      {/* Badge for item count */}
      <span
        style={{
          position: 'absolute',
          top: '-5px',
          right: '-10px',
          backgroundColor: 'green',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {itemCount}
      </span>
    </div>
  );
};

export default CartIcon;
