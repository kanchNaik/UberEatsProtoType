import React, { useState } from 'react';
import { Card, Button, Modal, ListGroup, Row, Col, Container } from 'react-bootstrap';

// Sample restaurant and menu data
const restaurant = {
  name: 'The Gourmet Kitchen',
  description: 'A fine dining experience with world-class cuisine.',
  menu: [
    { id: 1, name: 'Spaghetti Bolognese', price: 15 },
    { id: 2, name: 'Margherita Pizza', price: 12 },
    { id: 3, name: 'Caesar Salad', price: 10 },
    { id: 4, name: 'Grilled Chicken', price: 18 },
  ],
};

const Testpage = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (dish) => {
    setCart((prevCart) => [...prevCart, dish]);
  };

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  const handleFinalizeOrder = () => {
    alert('Order placed successfully!');
    setCart([]); // Clear the cart after order
    handleCloseCart();
  };

  const totalAmount = cart.reduce((total, dish) => total + dish.price, 0);

  return (
    <Container className="mt-5">
      <h2 className="text-center">{restaurant.name}</h2>
      <p className="text-center">{restaurant.description}</p>

      <h4 className="mt-4">Menu</h4>
      <Row className="g-3">
        {restaurant.menu.map((dish) => (
          <Col md={6} key={dish.id}>
            <Card>
              <Card.Body>
                <Card.Title>{dish.name}</Card.Title>
                <Card.Text>Price: ${dish.price}</Card.Text>
                <Button variant="primary" onClick={() => addToCart(dish)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Button variant="success" onClick={handleShowCart}>
          View Cart ({cart.length} items)
        </Button>
      </div>

      <Modal show={showCart} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ListGroup>
              {cart.map((dish, index) => (
                <ListGroup.Item key={index}>
                  {dish.name} - ${dish.price}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        {cart.length > 0 && (
          <Modal.Footer>
            <h5>Total: ${totalAmount}</h5>
            <Button variant="success" onClick={handleFinalizeOrder}>
              Finalize Order
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default Testpage;
