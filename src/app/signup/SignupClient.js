"use client";
import { useState, useEffect } from 'react';
import "./signup.css";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from 'react-icons/fc';
import Button from '../Components/syonit_button/sign';
import { useRouter } from 'next/navigation';
import { useUser } from '../Context/userContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePaystackPayment } from "react-paystack";

// Registration bot-check fee: ₦50 (Paystack amounts are in kobo). Keep in sync with the backend.
const REGISTRATION_FEE_KOBO = 5000;

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
  });
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const router = useRouter();
  const { setUser, setToken, setUserPrize } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  // react-paystack v6: hook gets the base config, per-payment values are passed at click time
  const initializePayment = usePaystackPayment({
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    amount: REGISTRATION_FEE_KOBO,
    currency: "NGN",
    email: formData.email,
  });

  // Recovery + referral capture: /signup?step=3 (user created earlier but never paid) and /signup?ref=CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) localStorage.setItem("refCode", ref);
      if (params.get("step") === "3") {
        const uid = localStorage.getItem("pendingUserId");
        const email = localStorage.getItem("pendingEmail");
        if (uid && email) {
          setPendingUserId(uid);
          setFormData((f) => ({ ...f, email }));
          setCurrentStep(3);
        }
      }
    } catch (e) {}
  }, []);

  const handlePaystackSuccess = async (response) => {
    const uid = pendingUserId || localStorage.getItem("pendingUserId");
    setVerifying(true);
    try {
      const res = await fetch(`${url}/api/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, reference: response.reference }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userPrize", JSON.stringify(data.userPrize));
        localStorage.removeItem("pendingUserId");
        localStorage.removeItem("pendingEmail");
        localStorage.removeItem("refCode");
        setToken(data.token);
        setUser(data.user);
        setUserPrize(data.userPrize);
        toast.success("Registration verified! Welcome aboard.");
        router.push("/signup/success");
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verify error:", err);
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handlePaystackClose = () => {
    toast.warn("Payment window closed. You can retry any time.");
  };

  // Starts the Paystack popup (wired to the SUBMIT button on step 3)
  const startPayment = () => {
    const uid = pendingUserId || localStorage.getItem("pendingUserId");
    const email = formData.email || localStorage.getItem("pendingEmail");
    if (!uid || !email) {
      toast.error("No pending registration found. Please sign up again.");
      return;
    }
    initializePayment({
      onSuccess: handlePaystackSuccess,
      onClose: handlePaystackClose,
      config: { reference: `SYONIT_${uid}_${Date.now()}`, email },
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
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
    const res = await fetch(`${url}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        username: formData.displayName || formData.email.split('@')[0],
        gender: formData.gender,
        ageBracket: formData.ageBracket,
        referralCode: localStorage.getItem("refCode") || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Signup failed");
      setSubmitting(false);
      return;
    }

    if (!data.userId) {
      console.warn("No userId returned by signup response", data);
    } else {
      setPendingUserId(data.userId);
      localStorage.setItem("pendingUserId", String(data.userId));
      localStorage.setItem("pendingEmail", formData.email);
    }

    toast.success("Signup successful! Complete payment to verify your account.");
    setCurrentStep(3);
  } catch (err) {
    console.error("Signup error:", err);
    toast.error("Signup failed");
  } finally {
    setSubmitting(false);
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
    if (currentStep === 3) {
      // account already created at step 2: going back would re-submit it, so leave the flow instead
      router.push("/login");
    } else if (currentStep > 1) {
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
              <option value="other">Prefer not to say</option>
            </select>
            <div className="social-login">
              <p>Social sign-in coming soon</p>
              <div className="social-buttons">
                <div className="social-button-text">
                  Apple
                  <button type="button" className="social-button" disabled aria-disabled="true" title="Coming soon">
                    <FaApple />
                  </button>
                </div>
                <div className="social-button-text">
                  <button type="button" className="social-button" disabled aria-disabled="true" title="Coming soon">
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
              Next, a tiny ₦50 payment confirms you're a real player, not a bot.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="form-container pay-card">
            <p className="instruction-text">One last step. A one-time payment proves you're a real player, not a bot.</p>
            <div className="pay-amount" aria-label="50 naira">₦50</div>
            <ul className="pay-points">
              <li>Secure card, bank or transfer via Paystack</li>
              <li>Pay once, never again</li>
            </ul>
            {verifying && <p className="instruction-text" role="status">Verifying your payment…</p>}
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
          handleVerifyOtp={startPayment}
        />
      </div>
    </div>
  );
}