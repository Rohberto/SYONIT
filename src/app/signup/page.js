"use client"
import { useState } from 'react';
import "./signup.css";
import {FaApple, FaGoogle} from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc';
import Button from '../Components/syonit_button/sign';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    displayName: '',
    termsAccepted: false,
    verificationCode: ['', '', '', '']
  });
  const router = useRouter();
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleVerificationCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) { // Allow only single digits
      const newCode = [...formData.verificationCode];
      newCode[index] = value;
      setFormData({ ...formData, verificationCode: newCode });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back(); // Navigate back if on the first step
    }
  
  };

  const handleResendCode = () => {
    alert('Code resent!'); // Placeholder for resend logic
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-container form-spacer">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
            />
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Osami"
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johnosami@email.com"
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••••••••••"
            />
            <div className="social-login">
              <p>or sign in with:</p>
              <div className="social-buttons">
                <div className="social-button-text">
                  Apple
                <button className="social-button">
                  <FaApple/>
                </button>
                </div>

                <div className="social-button-text"> 
                <button className="social-button">
                 <FcGoogle/> 
                </button>
                Google
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-container form-spacer">
            <div>
            <label>Display Name:</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="John"
            />
            </div>
            <div className="legal-section">
              <label>Legal:</label>
              <div className="terms">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
                <span>I accept the Terms & Conditions</span>
              </div>
            </div>
            <p className="instruction-text">
              A 4-digit code will be sent to your email inbox when you click Next. Kindly input code.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="form-container">
            <label>Verification Code:</label>
            <div className="verification-inputs">
              {formData.verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  className="verification-box"
                />
              ))}
            </div>
            <div className="resend-code">
              <p>Problem receiving code?</p>
              <button onClick={handleResendCode} className="resend-button">
                RESEND CODE
              </button>
              <hr/>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signContainer">
      <h1 className="signHeader">SYONIT</h1>
      <h2 className="subheader">CREATE YOUR PROFILE</h2>
      {renderStep()}
      <div className="progress-circles">
        <span className={currentStep >= 1 ? 'active' : ''}></span>
        <span className={currentStep >= 2 ? 'active' : ''}></span>
        <span className={currentStep >= 3 ? 'active' : ''}></span>
      </div>
      <div className="button-group">
        <Button
        currentStep={currentStep}
        handleBack={handleBack}
        handleNext={handleNext}
        />
      </div>
    </div>
  );
}