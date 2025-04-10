"use client";
import React, {useRef, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/MainHeader/mainHeader';
import "./login.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from 'react-icons/fa';
import { useUser } from '../Context/userContext';

const LoginScreen = () => {
    const {user, setUser} = useUser();
  const router = useRouter();
  const picture = useRef();
  const input = useRef();


  const handleSubmit = () => {
    setUser(true);
    localStorage.setItem("user", JSON.stringify(user))
    router.push("/Prize");
  }

  useEffect(() => {
    input.current.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          picture.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);


  return (
    <div className="sign-container">
      <Header/>

      {/* Input Fields */}
    <div className="input-container">
      <div className='profile_container'>
      <div className="profile-picture" id="profilePicture">
      <img src="/profile.png" alt="Profile Picture" id="profileImage" ref={picture}/>
    </div>
    </div>
        <div className="input-field">
          <label>First Name:</label>
          <input type="email" placeholder="Enter your first name" />
        </div>
        <div className="input-field">
          <label>Last Name:</label>
          <input type="email" placeholder="Enter your last name" />
        </div>
        <div className="input-field">
          <label>Profile Picture:</label>
            <input type="file" id="fileInput" accept="image/*" ref={input}/>
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
      <button className="apple-button">
        <span className="apple-icon"><FaApple/> </span> Sign in with Apple
      </button>

      <div className='sign_buttons_container'>
          <button  className='sign_stroke_links' onClick={() => {router.push("/Home");
      }}>Cancel</button>
    <button className='sign_stroke_links' onClick={() => {handleSubmit()}}>Enter</button>
  </div>
    </div>
  );
};

export default LoginScreen;

