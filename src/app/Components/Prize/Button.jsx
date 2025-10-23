"use client";
import React from "react";
import "./button.css"; // import the normal CSS file

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "md",
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`btn ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
