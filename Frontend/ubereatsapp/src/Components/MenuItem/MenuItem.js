import React, {useState } from 'react';
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'
import './MenuItem.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaPlus } from 'react-icons/fa'; 
import MenuItemAddModal from './MenuItemAddModal';

const MenuItem = ({ menu, restaurantid, restaurantname }) => {
  debugger
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
    <ImgTextCard
        maindivclass = "menu-item"
        txtdivclass = 'text-left menu-item-text'
        imgclass = 'img-fluid'
        imgsrc={`${process.env.PUBLIC_URL}/Assets/menuPizza.webp`}   
        alttext= 'Feed Your Employees'>
            <h5>{menu.dish_name}</h5>
            <p>{menu.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '3vh'}}>
            <h6>{menu.category}</h6>
            <button className="btn btn-primary w-40 d-flex justify-content-center align-items-center p-3" onClick={openModal}>
                <FaPlus className="me-1" /> {/* Icon with margin */}
                Add
            </button>
            {isModalOpen && <MenuItemAddModal item = {menu} closeModal={closeModal} restaurantid = {restaurantid} restaurantname={restaurantname}/>}
            </div>
            <p style={{textAlign:'left'}}>${menu.price}</p>
    </ImgTextCard>
    </div>
  );
};

export default MenuItem;
