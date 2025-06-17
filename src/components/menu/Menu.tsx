import React, { useState, useEffect } from 'react';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuHeaders = [
    "==> Enter Menu",
    ":: Main Console ::",
    "--[ ASCII MENU ]--",
    "> Choose Your Path",
    "LOAD_MENU.EXE",
    "[*] Press Start",
    "::: Options Hub :::",
    "/ Menu Initialized \\",
    "~*~ Control Central ~*~",
    "<< Adventure Menu >>",
    "--= Data Terminal =--",
    ":: Choose Your Quest ::",
    ">>> Accessing Menu",
    "[MENU_STATUS: READY]",
  ];
  
  

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [headerText, setHeaderText] = useState(menuHeaders[0]);

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * menuHeaders.length);
      setHeaderText(menuHeaders[randomIndex]);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="menu-overlay" onClick={onClose} />}
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>{headerText}</h2>
          <button className="menu-close" onClick={onClose}>×</button>
        </div>
        <div className="menu-content">
          {/* Add menu items here */}
          Oops! This one's still in the oven.
        </div>
      </div>
    </>
  );
};

export default Menu; 