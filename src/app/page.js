"use client";
import { useEffect } from "react";
import Onboarding from "./Components/Onboarding/Onboarding";
import Banner from "./Components/IntroBanner/Banner";
export default function Home() {
  useEffect(() => {
    function setDynamicHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setDynamicHeight);
    setDynamicHeight();
  }, []);
  return (
   <div className="">
    <Banner />
   </div>
  );
}
