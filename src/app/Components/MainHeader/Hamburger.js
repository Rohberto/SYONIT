import React, { useState } from "react";
import "./HamburgerMenu.css"; // Import the CSS file

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-container">
      {/* Hamburger Icon */}
      <div
        className={`hamburger-icon ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Dropdown Menu */}
      <div className={`dropdown-menu ${isOpen ? "menu-open" : ""}`}>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">How To Play</a>
          </li>
          <li>
            <a href="#contact">Invite Friends</a>
          </li>
          <li>
            <a href="#contact">Profile</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HamburgerMenu;
