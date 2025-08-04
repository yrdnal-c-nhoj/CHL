import React from 'react';
import './Header.css';

export default function Header({ visible }) {
  return (
    <div className={`title-container ${visible ? 'visible' : 'hidden'}`}>
     <div className="chltitle">🧊🫀🔭</div>
      <div className="bttitle">BorrowedTime</div> 
      
     
    </div>
  );
}
