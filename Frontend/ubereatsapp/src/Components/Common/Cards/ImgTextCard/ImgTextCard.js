import React from 'react'

const ImgTextCard = (props) => {
  return (
    <div className={props.maindivclass}>
        <div>
            <img
            src={props.imgsrc}  // Replace with the actual image URL
            alt={props.alttext}
            className={props.imgclass}
            />
        </div>
        <div className={props.txtdivclass}>
       {props.children}
        </div>
      </div>
  )
}

export default ImgTextCard