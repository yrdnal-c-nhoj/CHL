import React from 'react';

interface HeaderProps {
  visible: boolean;
}

const Header: React.FC<HeaderProps> = ({ visible }) => {
  return (
    <header style={{ display: visible ? 'block' : 'none' }}>
      <h1>Header</h1>
    </header>
  );
};

export default Header;
