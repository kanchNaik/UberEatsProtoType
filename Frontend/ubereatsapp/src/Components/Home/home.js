import React, { useEffect, useState } from 'react'
import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeliverySearch from '../DeliverySearch/DeliverySearch'
import HomeBottomCard from '../HomeBottomCard/HomeBottomCard'
import CityList from './CityList'
import { NavLink, useNavigate   } from 'react-router-dom';
import { getUserInfo } from '../../Utilities/UserUtils';


const Home = ({}) => {
  const user = getUserInfo();
  const [selectedlocation, setLocation] = useState('');
  const navigate = useNavigate();

  const onSelectSearchItem = (selectedLocation) =>
  {
    setLocation(selectedLocation)
  }

   const handleSearch = (query) => {
    console.log('Searching for:', selectedlocation);

    navigate('/feed', { state: { location: selectedlocation } });

  };

  return (
    <div className="app">
    {/* Navbar */}
   

    {/* Header Section */}
    <header className="container-fluid py-5" style={{ background: `url(${`${process.env.PUBLIC_URL}/Assets/ubereatsHomeBackground.webp`}) no-repeat center center/cover`, height: '100vh' }}>
      <div className='container herocontainer'>
        <h1 className="mb-4 ho">Order delivery near you</h1>
        <div className="row justify-content">
          <div className="col-md-8">
              <DeliverySearch
              handleSearch = {handleSearch}
              onSelect = {onSelectSearchItem}
              />
           {!user && <NavLink to = '/signin'> <b><a href="/" className="text-dark">Or Sign in</a></b></NavLink>}
          </div>
        </div>
        </div>
    </header>
    {/* Food Image Section */}
    <div className="container-fluid" style={{ marginTop: '6%', height:'70vh' }}>
      <HomeBottomCard/>
    </div>

  <div className='container-fluid'>
  <div className='container' style={{ height: '100vh', overflowY: 'auto' }}>
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

    {/* City List (make sure CityList component exists and works as intended) */}
    <div style={{ paddingTop: '20px' }}>
      <CityList />
    </div>
  </div>

  <div className='container-fluid'>

  </div>
</div>

  </div>
  )
}

export default Home