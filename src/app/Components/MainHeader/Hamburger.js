import React, { useState } from "react";
import "./HamburgerMenu.css"; // Import the CSS file
import Link from "next/link";
import { useUser } from '../../Context/userContext';
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const {setUser} = useUser();

  const logOut = () => {
    setUser(false);
    localStorage.setItem("user", false);  }

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
            <Link href="/Home">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/Prize">Select Prize</Link>
          </li>
          <li>
            <Link href="/play">How To Play</Link>
          </li>
          <li>
            <Link href="#contact">Invite Friends</Link>
          </li>
          <li>
            <Link href="/user_profile">Profile</Link>
          </li>
          <li onClick={() => logOut()}>
            <Link href="/Home">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HamburgerMenu;
