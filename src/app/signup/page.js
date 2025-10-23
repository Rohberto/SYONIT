"use client"
import { useState, useContext } from 'react';
import "./signup.css";
import {FaApple, FaGoogle} from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc';
import Button from '../Components/syonit_button/sign';
import { useRouter } from 'next/navigation';
import { useUser } from '../Context/userContext';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    displayName: '',
    gender: '', // ✅ added
    ageBracket: '', // ✅ added
    termsAccepted: false,
    verificationCode: ['', '', '', '']
  });
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const router = useRouter();
  const {user, setUser, setToken} = useUser();

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

  // Submit signup on Step 2
  const handleSubmit = async () => {
    // basic validation
    if (!formData.termsAccepted) {
      alert("Please accept Terms & Conditions to proceed");
      return;
    }
    if (!formData.fullName || !formData.email || !formData.password || !formData.gender || !formData.ageBracket) {
      alert("Please fill in all required fields (first name, last name, email, password, gender, age bracket)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          username: formData.displayName || formData.email.split('@')[0],
          gender: formData.gender, // ✅ added
          ageBracket: formData.ageBracket // ✅ added
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend should send helpful message
        alert(data.message || "Signup failed");
        setSubmitting(false);
        return;
      }

      // try multiple shapes: { userId } or { user: { id } } or { user }
      const uid = data.userId || (data.user && (data.user.id || data.user.userId)) || data.id || null;
      if (!uid) {
        // fallback: maybe backend returned user object directly with id
        if (data.user && data.user.id) {
          setPendingUserId(data.user.id);
          localStorage.setItem("userId", String(data.user.id));
        } else {
          // still proceed but store nothing (verify endpoint needs userId or email)
          console.warn("No userId returned by signup response", data);
        }
      } else {
        setPendingUserId(uid);
        localStorage.setItem("pendingUserId", String(uid));
      }

      // go to OTP screen
      setCurrentStep(3);
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong while signing up.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const uid = pendingUserId || localStorage.getItem("pendingUserId");
      if (!uid) {
        alert("No pending user to resend code for.");
        return;
      }
      // optional endpoint; implement /api/auth/resend-otp on backend
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Unable to resend code");
        return;
      }
      alert("Code resent to your email.");
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert("Failed to resend code");
    }
  };

  // Verify the 4-digit code (Step 3)
  const handleVerifyOtp = async () => {
    const code = formData.verificationCode.join("");
    if (code.length !== 4) {
      alert("Please enter the 4-digit code.");
      return;
    }

    const uid = pendingUserId || localStorage.getItem("pendingUserId");
    if (!uid) {
      alert("No pending user to verify. Please signup again.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("http://localhost:4000/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, otp: code }),
      });
      const data = await res.json();
      
    if (res.ok) {
  // store token (or use cookie)
  localStorage.setItem("token", data.token);
  setToken(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
  // navigate to home
} else {
  alert(data.message || "OTP verification failed");
  setVerifying(false);
}

      // success: clear pending and navigate to Home (or login)
      alert("Account verified! Redirecting...");
      router.push("/profile");
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // Navigation - keep your original function names and flow
  const handleNext = () => {
    if (currentStep === 2) {
      handleSubmit(); // submit signup + trigger OTP
    } else if (currentStep < 3) {setCurrentStep(currentStep + 1)};
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back(); // Navigate back if on the first step
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-container form-spacer">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
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

          <label>Age Bracket:</label>
            <select name="ageBracket" value={formData.ageBracket} onChange={handleInputChange}>
              <option value="">Select Age Range</option>
              <option value="7-12">7 - 12</option>
              <option value="13-17">13 - 17</option>
              <option value="18+">18 and above</option>
            </select>

            {/* ✅ Added gender and age bracket */}
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>


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
              <button onClick={handleResendCode} className="resend-button" disabled={submitting}>
                RESEND CODE
              </button>
              <hr/>
            </div>
            <div style={{ marginTop: 12 }}>
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
          handleVerifyOtp={handleVerifyOtp}
        />
      </div>
    </div>
  );
}
