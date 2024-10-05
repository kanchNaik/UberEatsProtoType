import React from 'react'

const ImgTextCard = ({maindivclass, txtdivclass, imgclass, imgsrc, alttext, children}) => {
  return (
    <div className={maindivclass}>
        <div>
            <img
            src={imgsrc}  // Replace with the actual image URL
            alt={alttext}
            className={imgclass}
            />
        </div>
        <div className={txtdivclass}>
       {children}
        </div>
      </div>
  )
}

export default ImgTextCard