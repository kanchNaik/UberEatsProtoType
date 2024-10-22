import React from 'react'
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'
import { useNavigate } from 'react-router-dom';

function DishCard({dish}) {
    const navigate = useNavigate();

    const openClick = () => {
        navigate(`/restaurant/dish/edit/${dish.id}`);
      };

  return (
    <ImgTextCard
    maindivclass = "menu-item"
    txtdivclass = 'text-left menu-item-text'
    imgclass = 'img-fluid'
    imgsrc= {`${process.env.PUBLIC_URL}/Assets/menuPizza.webp`}       
    alttext= 'Feed Your Employees'>
        <h5>{dish.dish_name}</h5>
        <p className='description'>{dish.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '3vh'}}>
        <h6>{dish.category}</h6>
        <button className="btn btn-primary w-40 d-flex justify-content-center align-items-center p-3" onClick={openClick}>
            <i className="bi bi-pencil"></i>
            Edit
        </button>
        </div>
        <p style={{textAlign:'left'}}>${dish.price}</p>
    </ImgTextCard>
  )
}

export default DishCard