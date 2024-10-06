import React from 'react'
import { NavLink } from 'react-router-dom';

function HomeNavbar() {
  return (
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
              <NavLink to="/signup"><button className="btn btn-dark roundedButton">Sign up</button></NavLink>
            </li>
          </ul>
        </div>
    </div>
  </nav>
  )
}

export default HomeNavbar