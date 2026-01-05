import { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";
import { BsBook } from "react-icons/bs";
import { useUser } from "../Context/userContext"; // Assuming this is the correct path
import "./MainHeader.css";

const Header = () => {
  const { user, setUser } = useUser(); // Access user from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle mobile navbar
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header_section">
      <div className="profile_icon" onClick={toggleMenu} data-guide="profile">
        {user?.image_url ? (
          <img src={user.image_url} alt="Profile" className="profile-pic" />
        ) : (
          <FaRegUser />
        )}
        <span className="online"></span>
      </div>
      <h1 className="headerr">SYONIT</h1>
      <div className="book_icon" data-guide="rules">
        <BsBook />
      </div>

      {/* Mobile Navbar */}
      <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-content">
          <h2>Profile Information</h2>
          <p><strong>Full Name:</strong> {user?.fullName || "N/A"}</p>
          <p><strong>Username:</strong> {user?.username || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Gender:</strong> {user?.gender || "N/A"}</p>
          <p><strong>Age Bracket:</strong> {user?.ageBracket || "N/A"}</p>
          <p><strong>Global Points:</strong> {user?.globalPoints || 0}</p>
          <p><strong>Role:</strong> {user?.role || "N/A"}</p>
          <p><strong>Created At:</strong> {new Date(user?.createdAt).toLocaleDateString() || "N/A"}</p>
          <p><strong>Updated At:</strong> {new Date(user?.updatedAt).toLocaleDateString() || "N/A"}</p>
          {user?.isVerified && <p><strong>Verified:</strong> Yes</p>}
          {user?.isSubscribed && <p><strong>Subscribed:</strong> Yes</p>}
          <button onClick={toggleMenu} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;