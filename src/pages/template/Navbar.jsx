import React from 'react'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../app/slices/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">MC</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link active" >Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/category" className="nav-link" >Category</Link>
              </li>
              <li className="nav-item">
                <Link to="/product" className="nav-link" >Product</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="navbar-nav">
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li><a className="dropdown-item" href="#">My Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
     
    </div>
  )
}

export default Navbar