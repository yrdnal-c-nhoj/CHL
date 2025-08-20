import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TopNav.css';


export default function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* <div className="topmotto">
        PLUS⬩ARS⬩CITIUS⬩OMNI⬩TEMPORE⬩NAM⬩QUALISQUE*
      </div> */}

      <div className="topnavchl">
        🧊🫀🔭Cubist Heart Laboratories🧊🫀🔭  
      </div>

<div className='topnavbgcolor'>

      <div className="topnavbt">
        BorrowedTime
      </div>

      <div className="topnavtag">
        a new clock every day
      </div> 
</div>
      <nav className="navbar">
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              HOME
            </NavLink>
          </li>

 <li className="nav-item">
            <NavLink 
              to="/today" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              Today
            </NavLink>
          </li> 


          <li className="nav-item">
            <NavLink 
              to="/manifesto" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              MANIFESTO
            </NavLink>
          </li>


          <li className="nav-item">
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </NavLink>
          </li> 

         
        
          <li className="nav-item">
            <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}









