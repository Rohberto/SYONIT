"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../Components/MainHeader/mainHeader';
import "./login.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from 'react-icons/fa';
import { useUser } from '../Context/userContext';
import Button from '../Components/syonit_button/sign';

const LoginScreen = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const picture = useRef();
  const input = useRef();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    if (acceptedTerms) {
      setUser(true);
      localStorage.setItem("user", true);
      router.push("/Home");
    } else {
      alert("Accept terms and conditions to proceed");
    }
  };

 /* useEffect(() => {
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
*/

  return (
    <div className="sign-container">
      <Header />

      {/* Input Fields */}
      <div className="input-container">
        
        <div className="input-field">
          <label>First Name:</label>
          <input type="text" placeholder="Enter your first name" />
        </div>
        <div className="input-field">
          <label>Last Name:</label>
          <input type="text" placeholder="Enter your last name" />
        </div>
        
        <div className="input-field">
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="input-field">
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        {/* Terms and Conditions Checkbox */}
        <div className=" terms-container">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            I accept the{' '}
            <Link href="/terms" className="terms-link">
              Terms and Conditions
            </Link>
          </label>
        </div>
      </div>

      {/* Sign in with Apple/Google Buttons */}
      <button className="apple-button">
        <span className="apple-icon"><FcGoogle /></span> Sign in with Google
      </button>
      <button className="apple-button">
        <span className="apple-icon"><FaApple /></span> Sign in with Apple
      </button>

      <div className='sign_buttons_container'>
        <Button handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default LoginScreen;