import React, { useState } from 'react';
import './MenuItemAddModal.css'; // Optional: CSS for styling the modal

const MenuItemAddModal = ({ closeModal }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2>50 - PAD THAI</h2>
        <p>$16.95</p>
        <p>Fresh rice stick noodles stir-fried with tofu, egg, bean sprouts, and green onions. Served with a slice of lime and crushed peanuts.</p>
        
        <h3>Make it with (41, 50, 52)</h3>
        <form className="options-form">
          <div>
            <input 
              type="radio" 
              id="vegetarian-tofu" 
              name="option" 
              value="Vegetarian Tofu" 
              onChange={handleOptionChange}
            />
            <label htmlFor="vegetarian-tofu">Vegetarian Tofu (With Egg)</label>
          </div>

          <div>
            <input 
              type="radio" 
              id="vegan-tofu" 
              name="option" 
              value="Vegan Tofu" 
              onChange={handleOptionChange}
            />
            <label htmlFor="vegan-tofu">Vegan Tofu (No Egg)</label>
          </div>

          <div>
            <input 
              type="radio" 
              id="chicken" 
              name="option" 
              value="Chicken" 
              onChange={handleOptionChange}
            />
            <label htmlFor="chicken">Chicken (+$1.00) <span className="popular">Popular</span></label>
          </div>

          <div>
            <input 
              type="radio" 
              id="pork" 
              name="option" 
              value="Pork" 
              onChange={handleOptionChange}
            />
            <label htmlFor="pork">Pork (+$2.00)</label>
          </div>

          <div>
            <input 
              type="radio" 
              id="shrimp" 
              name="option" 
              value="Shrimp" 
              onChange={handleOptionChange}
            />
            <label htmlFor="shrimp">Shrimp (+$2.00)</label>
          </div>
        </form>
        
        <button className="submit-btn" onClick={() => alert(`Selected: ${selectedOption}`)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItemAddModal;
