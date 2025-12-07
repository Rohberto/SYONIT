"use client";
import { useState, useRef } from 'react';
import "./signup.css";
import { FaApple, FaGoogle } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import Button from '../Components/syonit_button/sign';
import { useRouter } from 'next/navigation';
import { useUser } from '../Context/userContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    displayName: '',
    gender: '',
    ageBracket: '',
    termsAccepted: false,
    verificationCode: ['', '', '', '']
  });
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const router = useRouter();
  const { user, setUser, setToken } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  // Create refs for OTP input fields
  const inputRefs = useRef([null, null, null, null].map(() => useRef(null)));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleVerificationCodeChange = (index, value, e) => {
    if (/^\d?$/.test(value)) { // Allow only single digits
      const newCode = [...formData.verificationCode];
      newCode[index] = value;
      setFormData({ ...formData, verificationCode: newCode });

      // Move focus to next input if a digit was entered and not the last input
      if (value && index < 3) {
        inputRefs.current[index + 1].current.focus();
      }

      // Move focus to previous input on backspace if the field is empty
      if (!value && e.key === 'Backspace' && index > 0) {
        inputRefs.current[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async () => {
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
      const res = await fetch("https://syonit-js.onrender.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          username: formData.displayName || formData.email.split('@')[0],
          gender: formData.gender,
          ageBracket: formData.ageBracket
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        setSubmitting(false);
        return;
      }

      const uid = data.userId || (data.user && (data.user.id || data.user.userId)) || data.id || null;
      if (!uid) {
        if (data.user && data.user.id) {
          setPendingUserId(data.user.id);
          localStorage.setItem("userId", String(data.user.id));
        } else {
          console.warn("No userId returned by signup response", data);
        }
      } else {
        setPendingUserId(uid);
        localStorage.setItem("pendingUserId", String(uid));
      }
      toast.success("Signup successful! Verification code sent to your email.");
      setCurrentStep(3);
    } catch (err) {
      console.error("Signup error:", err);
     toast.error("Signup failed");
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
     toast.success("Verification code resent to your email.");
    } catch (err) {
      console.error("Resend OTP error:", err);
     toast.error("Unable to resend code");
    }
  };

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
      const res = await fetch("https://syonit-js.onrender.com/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, otp: code }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Verification successful! Welcome aboard.");
        router.push("/profile");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      handleSubmit();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-container form-spacer">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              required
            />
       <div className="password-input-wrapper" style={{ position: "relative" }}>
          <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter Password"
          required
          style={{ paddingRight: "36px" }}
          />
        <span
        onClick={() => setShowPassword((prev) => !prev)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
            transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#fff",
          zIndex: 20,
          }}
        tabIndex={0}
        aria-label={showPassword ? "Hide password" : "Show password"}
    >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
            <select name="ageBracket" value={formData.ageBracket} onChange={handleInputChange} required>
              <option value="">Select Age Range</option>
              <option value="7-12">7 - 12</option>
              <option value="13-17">13 - 17</option>
              <option value="18+">18 and above</option>
            </select>
            <select name="gender" value={formData.gender} onChange={handleInputChange} required>
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
                    <FaApple />
                  </button>
                </div>
                <div className="social-button-text">
                  <button className="social-button">
                    <FcGoogle />
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
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value, e)}
                  onKeyDown={(e) => handleVerificationCodeChange(index, e.target.value, e)}
                  className="verification-box"
                  ref={inputRefs.current[index]}
                  autoFocus={index === 0} // Auto-focus first input
                />
              ))}
            </div>
            <div className="resend-code">
              <p>Problem receiving code?</p>
              <button onClick={handleResendCode} className="resend-button" disabled={submitting}>
                RESEND CODE
              </button>
              <hr />
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