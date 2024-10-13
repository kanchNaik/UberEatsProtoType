import React from 'react'

function FeedNavbar({onclick}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
        <div className="container-fluid">
            <button type="button" className='navbarmenue' onClick={onclick}>
                <i class="bi bi-list hamberger-icon"></i>
            </button>
            <a className="navbar-brand" href="/">Uber Eats</a>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                    <a className="nav-link" href="/">Delivery</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/">Pickup</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="/">San Jose Diridon Station</a>
                    </li>
                </ul>
            <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search Uber Eats" />
            </form>
            </div>
        </div>
  </nav>
  )
}

export default FeedNavbar