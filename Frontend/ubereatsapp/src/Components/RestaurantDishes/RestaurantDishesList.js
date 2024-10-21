import React, { Component } from 'react';
import axios from 'axios';
import DishCard from './DishCard';
import Cookies from 'js-cookie';

class RestaurantDishesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: [],
      error: null,
    };
  }

  componentDidMount() {
    this.fetchRestaurants();
  }

 ;

  fetchRestaurants = () => {
    const restaurantId =  Cookies.get('user_id')
    axios
      .get(`http://127.0.0.1:8000/api/restaurants/${restaurantId}/dishes`, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        withCredentials: true, // Send cookies like sessionid
      })
      .then((response) => {
        console.log('Data:', response.data);
        this.setState({ dishes: response.data });
      })
      .catch((error) => {
        console.error('Error fetching dishes:', error);
        this.setState({ error: 'Failed to fetch dishes' });
      });
  };

  render() {
    const { dishes, error } = this.state;

    return (
      <div className="row">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {dishes.map((dish) => (
          <div className="col-4" key={dish.id}>
            <div className="dish-info-container">
              <h2 className="dish-name">{dish.name}</h2>
            </div>
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    );
  }
}

export default RestaurantDishesList;
