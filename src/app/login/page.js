"use client";
import { useState } from "react";
import "../signup/signup.css";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Button from "../Components/syonit_button/login";
import { useUser } from "../Context/userContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const {setToken, setUser, setUserPrize} = useUser();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${url}/api/login`, { // 👈 change this to your API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }else {
      // save token to localStorage (or cookies if SSR)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",JSON.stringify(data.user));
      localStorage.setItem("userPrize",JSON.stringify(data.userPrize));
      setToken(data.token);
      setUser(data.user);
      setUserPrize(data.userPrize);
      toast.success("Login successful! Redirecting...");
      // redirect user (Next.js router)
      router.push("/Home")// 👈 change route
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signContainer">
      <h1 className="signHeader">SYONIT</h1>
      <h2 className="subheader">LOGIN TO YOUR PROFILE</h2>

      <form className="form-container form-spacer" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="johnosami@email.com"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••••••••••"
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="social-login">
          <p>or sign in with:</p>
          <div className="social-buttons">
            <button type="button" className="social-button">
              <FaApple />
            </button>
            <button type="button" className="social-button">
              <FcGoogle />
            </button>
          </div>
        </div>

        <div className="button-group">
          <Button text={loading ? "Logging in..." : "Login"} disabled={loading} />
        </div>
      </form>
    </div>
  );
}
