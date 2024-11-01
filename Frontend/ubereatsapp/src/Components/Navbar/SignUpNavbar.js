import React from 'react'
import './SignUpNavbar.css'
import { NavLink, useLocation  } from 'react-router-dom';

function SignUpNavbar() {

  const location = useLocation();

  return (
    <nav className="navbarSignup">
    <div className="navbarSignup-logo">
    <NavLink to="/"><svg xmlns="http://www.w3.org/2000/svg" width="121" height="21" fill="none"><path fill="#06C167" d="M63.5.3H77v3.3h-9.9v4.8h9.7v3.2H67v4.8h10v3.3H63.4V.3zM114 20c4.1 0 6.5-2 6.5-4.7 0-2-1.4-3.4-4.3-4l-3.1-.7c-1.8-.3-2.3-.6-2.3-1.3 0-.8.8-1.4 2.4-1.4 1.7 0 3 .5 3.3 2h3.6C120 7 117.8 5 113.4 5c-3.7 0-6.4 1.6-6.4 4.6 0 2 1.5 3.4 4.6 4l3.4.9c1.4.2 1.8.6 1.8 1.2 0 .9-1 1.4-2.7 1.4-2 0-3.3-.4-3.7-2h-3.7c.5 3 2.8 5 7.3 5zm-8.3-3.6H103c-.8 0-1.3-.3-1.3-1.1V8.6h4V5.4h-4v-4H98v4h-2.7v3.2H98v7.6c0 2 1.4 3.5 3.8 3.5h4v-3.3zm-12-11v14.3h-3.5v-1.3a7.5 7.5 0 110-11.7V5.4h3.6zm-3.5 7.1c0-2.4-1.9-4.3-4.3-4.3s-4.3 1.9-4.3 4.3a4.3 4.3 0 108.6 0z"></path><path fill="#FFF" d="M8 17.4c2.7 0 4.7-2 4.7-5.1V.3h3v19.4h-3v-1.8a7 7 0 01-5 2.1c-4.2 0-7.4-3-7.4-7.6V.4h3v11.9c0 3 2 5.1 4.7 5.1zm9.8 2.3h2.7v-1.8A7.3 7.3 0 0033 12.7c0-4.1-3.2-7.4-7.3-7.4a7 7 0 00-5 2v-7h-2.8v19.4zm7.6-2.2a4.9 4.9 0 01-4.9-4.9 4.9 4.9 0 119.7 0c0 2.8-2.2 5-4.8 5zm16-12.2a7.2 7.2 0 00-7.3 7.3c0 4.2 3.2 7.4 7.5 7.4 2.5 0 4.6-1.2 6-3l-2-1.5c-1 1.4-2.4 2-4 2a4.7 4.7 0 01-4.7-4h11.5v-.9c0-4.2-3-7.3-7-7.3zm-4.4 6a4.4 4.4 0 014.3-3.6c2 0 3.8 1.5 4.2 3.6H37zm20-3.2V5.5h-1c-1.5 0-2.6.7-3.3 1.8V5.6h-2.8v14h2.8v-8c0-2.1 1.3-3.5 3.1-3.5H57z"></path></svg></NavLink>
    </div>
    {location.pathname !== '/signin' && (
        <NavLink to="/signin" style={{ textDecoration: 'none', color: 'White' }}>
          <div>Sign In</div>
        </NavLink>
      )}
  </nav>
  )
}

export default SignUpNavbar