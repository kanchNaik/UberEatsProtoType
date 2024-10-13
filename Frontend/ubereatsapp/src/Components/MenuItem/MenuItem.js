import React from 'react';
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'
import './MenuItem.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaPlus } from 'react-icons/fa'; 

const MenuItem = ({ menu }) => {
  return (
    <div>
    <ImgTextCard
        maindivclass = "menu-item"
        txtdivclass = 'text-left menu-item-text'
        imgclass = 'img-fluid'
        imgsrc={menu.image}
        alttext= 'Feed Your Employees'>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '3vh'}}>
            <h5>{menu.name}</h5>
            <button className="btn btn-primary w-40 d-flex justify-content-center align-items-center p-3">
                <FaPlus className="me-1" /> {/* Icon with margin */}
                Add
            </button>
            </div>
            <p style={{textAlign:'left'}}>${menu.price}</p>
    </ImgTextCard>
    </div>
  );
};

export default MenuItem;
