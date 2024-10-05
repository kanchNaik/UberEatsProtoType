import React, { useEffect } from 'react'
import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import heroback from '../../Assets/ubereatsHomeBackground.webp';
import DeliverySearch from '../DeliverySearch/DeliverySearch'
import HomeBottomCard from '../HomeBottomCard/HomeBottomCard'
import MapWithLocations from '../MapWithLocations/MapWithLocations'
import CityList from './CityList'

const Home = () => {
  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const handleScroll = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            navbar.classList.add("scrolled"); // Add class when scrolled
        } else {
            navbar.classList.remove("scrolled"); // Remove class when at the top
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
}, []);

  return (
    <div className="app">
    {/* Navbar */}
    <nav id='navbar' className="navbar navbar-expand-lg navbar-light px-4 navbarHome">
      <div className="container-fluid">
      <button type="button" className='navbarmenue'>
      <i class="bi bi-list hamberger-icon"></i>
      </button>
          {/* Uber Eats brand */}
          <span className="navbar-brand ms-3">Uber Eats</span>

          {/* Login and Sign up buttons */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-light btn-outline-dark me-2 roundedButton">Log in</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-dark roundedButton">Sign up</button>
              </li>
            </ul>
          </div>
      </div>
    </nav>

    {/* Header Section */}
    <header className="container-fluid py-5" style={{ background: `url(${heroback}) no-repeat center center/cover`, height: '100vh' }}>
      <div className='container herocontainer'>
        <h1 className="mb-4 ho">Order delivery near you</h1>
        <div className="row justify-content">
          <div className="col-md-8">
              <DeliverySearch/>
            <b><a href="/" className="text-dark">Or Sign in</a></b>
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