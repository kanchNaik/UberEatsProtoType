import React from 'react'
import ImgTextCard from '../Common/Cards/ImgTextCard/ImgTextCard'
import { NavLink } from 'react-router-dom'


function HomeBottomCard() {
  return (
    <div className="row align-items-center">
        <ImgTextCard
            maindivclass = "col-md-4"
            txtdivclass = 'text-left'
            imgclass = 'img-fluid'
            imgsrc={`${process.env.PUBLIC_URL}/Assets/homeimg1.webp`}
            alttext= 'Feed Your Employees'
        >
            <h2>Feed your employees</h2>
            <a href="/" className="business-account-link">Create a business account</a>
        </ImgTextCard>

        <NavLink to = '/merchantsignup' className='col-md-4'>
        <ImgTextCard
        maindivclass = ""
        txtdivclass = 'text-left'
        imgclass = 'img-fluid'
        imgsrc={`${process.env.PUBLIC_URL}/Assets/home2.webp`}
        alttext= 'Feed Your Employees'>
            <h2>Your Restaurant Delivered</h2>
            <a href="/" className="business-account-link">Add Your Restaurant</a>
        </ImgTextCard>
        </NavLink>

        <ImgTextCard
        maindivclass = "col-md-4"
        txtdivclass = 'text-left'
        imgclass = 'img-fluid'
        imgsrc={`${process.env.PUBLIC_URL}/Assets/homwimg3.webp`}
        alttext= 'Feed Your Employees'>
            <h2>Deliver with Uber Eats</h2>
            <a href="/" className="business-account-link">Create a business account</a>
        </ImgTextCard>
    </div>
  )
}

export default HomeBottomCard