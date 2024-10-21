import React from 'react'

function DishMenu({dish}) {
  return (
    <ImgTextCard
    maindivclass = "menu-item"
    txtdivclass = 'text-left menu-item-text'
    imgclass = 'img-fluid'
    imgsrc={dish.image}
    alttext= 'Feed Your Employees'>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '3vh'}}>
        <h5>{dish.name}</h5>
        <button className="btn btn-primary w-40 d-flex justify-content-center align-items-center p-3" onClick={openModal}>
            <i className="bi bi-pencil"></i>
            Edit
        </button>
        </div>
        <p style={{textAlign:'left'}}>${dish.price}</p>
    </ImgTextCard>
  )
}

export default DishMenu