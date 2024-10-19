import React,  { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import './HomeNavbar.css'

const HomeNavbar = ({onClick, user}) => {
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
    <nav id='navbar' className="navbar navbar-expand-lg navbar-light px-4 navbarHome">
    <div className="container-fluid">
    <div>
    <button type="button" className='navbarmenue' onClick={onClick}>
    <i class="bi bi-list hamberger-icon"></i>
    </button>
        {/* Uber Eats brand */}
        <NavLink to="/"><span className="navbar-brand ms-3">Uber Eats</span></NavLink>
        </div>
        
        {/* Login and Sign up buttons */}
       {!user && (<div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
            <NavLink to="/signin"><button className="btn btn-light btn-outline-dark me-2 roundedButton">Log in</button></NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup"><button className="btn btn-dark roundedButton">Sign up</button></NavLink>
            </li>
          </ul>
        </div>)}
    </div>
  </nav>
  )
}

export default HomeNavbar