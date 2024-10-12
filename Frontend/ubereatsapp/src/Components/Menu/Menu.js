import React, { useState } from 'react';
import './Menu.css'; // Assuming you're adding CSS to a separate file

const Menu = () => {
  const [selectedItem, setSelectedItem] = useState('Featured items');

  const menuItems = [
    'Featured items',
    'Picked for you',
    'Quick Picks',
    'Daily Deals',
    'NEW ITEMS – Oven-Baked Pastas',
    'Build Your Own Pizza',
    'Specialty Pizzas',
    'Oven-Baked Dips & Twists Combos',
    'Breads',
    'Loaded Tots',
  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="menu">
      <h1>Menu</h1>
      <p>10:00 AM – 12:00 AM</p>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={selectedItem === item ? 'active' : ''}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
