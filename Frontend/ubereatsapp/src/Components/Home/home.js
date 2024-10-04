import React from 'react'
import './home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import heroback from '../../Assets/ubereatsHomeBackground.webp'

const home = () => {
  return (
    <div className="app">
    <div style={{ background: `url(${heroback}) no-repeat center center/cover`, height: '100vh' }}>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-light px-4">
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
    <header className="container-fluid text-center py-5" >
      <h1 className="display-4 mb-4">Order delivery near you</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter delivery address"
              aria-label="Delivery address"
            />
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Deliver now
            </button>
            <button className="btn btn-dark">Search here</button>
          </div>
          <a href="/" className="text-dark">Or Sign in</a>
        </div>
      </div>
    </header>
    </div>
    {/* Food Image Section */}
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <img
            src="burger-fries.jpg"
            alt="Burger and fries"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  </div>
  )
}

export default home