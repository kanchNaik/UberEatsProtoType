import React, { Component } from 'react';
import axios from 'axios';
import DishCard from './DishCard';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

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
      .get(`${BASE_API_URL}/api/restaurants/${restaurantId}/dishes`, {
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
        messageService.showMessage('error', 'Error fetching dishes');
      });
  };

  render() {
    const { dishes, error } = this.state;

    return (
    <div className='container'>
      <div className="row">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {dishes.map((dish) => (
          <div className="col-4" key={dish.id}>
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
      </div>
    );
  }
}

export default RestaurantDishesList;
