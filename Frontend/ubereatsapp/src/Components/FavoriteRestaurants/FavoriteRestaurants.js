import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // To handle CSRF token
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import './FavoriteRestaurants.css'; // External CSS for custom styling
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const FavoriteRestaurants = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite restaurants
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/favorite/`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      if (response.status === 200) {
        const favoriteRestaurants = response.data.map((entry) => ({
          ...entry.restaurant,
          favoriteId: entry.id,
        }));
        setFavorites(favoriteRestaurants);
      }
    } catch (error) {
      console.error('Error fetching favorite restaurants:', error);
      setError('Failed to load favorite restaurants. Please try again.');
      messageService.showMessage('error', 'Failed to load favorite restaurants. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  // Remove a restaurant from favorites
  const removeFavorite = async (favoriteId) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/api/favorite/${favoriteId}/`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      });

      if (response.status === 204) {
        setFavorites(favorites.filter(favorite => favorite.favoriteId !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      messageService.showMessage('error', 'Error removing favorite.')
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (favorites.length === 0) {
    return <p>No favorite restaurants found.</p>;
  }

  return (
    <Container className="favorites-list mt-4">
      <h2>Your Favorite Restaurants</h2>
      <Row>
        {favorites.map((restaurant) => (
          <Col key={restaurant.favoriteId} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="favorite-card h-100">
              <Card.Img
                variant="top"
                src={restaurant.image || 'default-image.png'}
                alt={restaurant.restaurant_name}
                className="favorite-image"
              />
              <Card.Body>
                <Card.Title>{restaurant.restaurant_name}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {restaurant.location}<br />
                  <strong>Rating:</strong> ⭐ {restaurant.rating}<br />
                  <strong>Delivery Time:</strong> {restaurant.delivery_time}<br />
                  <strong>Price Range:</strong> {restaurant.price_range}<br />
                  <strong>Contact:</strong> {restaurant.phone_number}
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => removeFavorite(restaurant.favoriteId)}
                >
                  Remove from Favorites
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FavoriteRestaurants;
