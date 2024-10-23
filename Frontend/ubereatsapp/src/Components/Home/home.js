import React, { useEffect, useState } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeliverySearch from '../DeliverySearch/DeliverySearch';
import HomeBottomCard from '../HomeBottomCard/HomeBottomCard';
import CityList from './CityList';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../Utilities/UserUtils';

const Home = () => {
  const user = getUserInfo();
  const [selectedLocation, setLocation] = useState('');
  const navigate = useNavigate();

  const onSelectSearchItem = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleSearch = (query) => {
    console.log('Searching for:', selectedLocation);
    navigate('/feed', { state: { location: selectedLocation } });
  };

  return (
    <div className="app">
      {/* Navbar */}
      {/* Header Section */}
      <header
        className="container-fluid py-5"
        style={{
          background: `url(${process.env.PUBLIC_URL}/Assets/ubereatsHomeBackground.webp) no-repeat center center/cover`,
          height: '100vh'
        }}
      >
        <div className="container herocontainer text-center">
          <h1 className="mb-4 ho">Order delivery near you</h1>
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-6 col-sm-12">
              <DeliverySearch handleSearch={handleSearch} onSelect={onSelectSearchItem} />
              {!user && (
                <NavLink to="/signin">
                  <b><a href="/" className="text-dark">Or Sign in</a></b>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Food Image Section */}
      <section className="container-fluid" style={{ marginTop: '6%', minHeight: '70vh' }}>
        <HomeBottomCard />
      </section>

      <section className="container-fluid">
        <div className="container" style={{ minHeight: '100vh', overflowY: 'auto' }}>
          {/* Google Maps iframe */}
          <div style={{ height: '50vh' }}>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1Fh2cdRKg3NN0YFgYz16LluDpgIL0o64&ehbc=2E312F"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* City List */}
          <div className="pt-4">
            <CityList />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
