"use client";
import React from "react";
import "./GlassyButton.css";

const GlassyButton = ({ children, onClick }) => {
  return (
    <div className="glass-btn-wrapper">
      <button className="glassy-btn" onClick={onClick}>
        {children}
      </button>

      {/* SVG Filters */}
      <svg style={{ display: "none" }}>
        {/* Container-like subtle distortion */}
        <filter id="btn-glass" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="77"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
};

export default GlassyButton;
