import React from 'react';
import './Menu.css';

const Menu = ({ categories, activeCategory }) => {
  return (
    <ul className="menu-list">
      {categories.map((category) => (
        <li
          key={category}
          className={`menu-list-item ${activeCategory === category ? 'active' : ''}`}
        >
          {category}
        </li>
      ))}
    </ul>
  );
};

export default Menu;
