import React from 'react';
import './GenericTitleNavbar.css'; // Import CSS for styling
import { NavLink } from 'react-router-dom';

const GenericTitleNavbar = ({title}) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <NavLink to='/' style={{color:'White'}}> {title} </NavLink>
      </div>
    </nav>
  );
};

export default GenericTitleNavbar;
