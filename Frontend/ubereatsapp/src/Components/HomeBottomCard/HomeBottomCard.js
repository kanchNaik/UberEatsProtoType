import React from 'react'
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'

import homeimg1 from '../../Assets/homeimg1.webp'
import homeimg2 from '../../Assets/home2.webp'
import homeimg3 from '../../Assets/homwimg3.webp'


function HomeBottomCard() {
  return (
    <div className="row align-items-center">
        <ImgTextCard
            maindivclass = "col-md-4"
            txtdivclass = 'text-left'
            imgclass = 'img-fluid'
            imgsrc={homeimg1}
            alttext= 'Feed Your Employees'
        >
            <h2>Feed your employees</h2>
            <a href="/" className="business-account-link">Create a business account</a>
        </ImgTextCard>

        <ImgTextCard
        maindivclass = "col-md-4"
        txtdivclass = 'text-left'
        imgclass = 'img-fluid'
        imgsrc={homeimg2}
        alttext= 'Feed Your Employees'>
            <h2>Your Restaurant Delivered</h2>
            <a href="/" className="business-account-link">Create a business account</a>
        </ImgTextCard>

        <ImgTextCard
        maindivclass = "col-md-4"
        txtdivclass = 'text-left'
        imgclass = 'img-fluid'
        imgsrc={homeimg3}
        alttext= 'Feed Your Employees'>
            <h2>Deliver with Uber Eats</h2>
            <a href="/" className="business-account-link">Create a business account</a>
        </ImgTextCard>
    </div>
  )
}

export default HomeBottomCard