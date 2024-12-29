import React from 'react';
import Bottom from '../Components/signBottom';
import Header from '../Components/Header';
import "./login.css";
import { FcGoogle } from "react-icons/fc";

const LoginScreen = () => {
  return (
    <div className="container">
      <Header/>

      {/* Input Fields */}
      <div className="input-container">
        <div className="input-field">
          <label>First Name:</label>
          <input type="email" placeholder="Enter your first name" />
        </div>
        <div className="input-field">
          <label>Last Name:</label>
          <input type="email" placeholder="Enter your last name" />
        </div>
        <div className="input-field">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="input-field">
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
      </div>

      {/* Sign in with Apple Button */}
      <button className="apple-button">
        <span className="apple-icon"><FcGoogle/> </span> Sign in with Google
      </button>

     <Bottom/>
    </div>
  );
};

export default LoginScreen;

