import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Message.css'; // Import custom CSS file for styling

const Message = ({ type, text, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Automatically dismiss the message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  if (!visible) return null;

  // Bootstrap alert classes based on the type of message
  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getAlertClass(type)} alert-dismissible fade show sticky-message`} role="alert">
      <div className="d-flex justify-content-between align-items-center">
        <span>{text}</span>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

// Type checking with PropTypes
Message.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default Message;
