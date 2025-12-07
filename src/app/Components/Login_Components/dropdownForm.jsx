"use client"
export const dynamic = "force-dynamic";
import { FcGoogle } from "react-icons/fc";
import {useState, useEffect} from 'react';
import "./page.css";
import Image from 'next/image';
import Pr from "../../Assets/pr.png";

const DropdownForm = ({drop, auth_state}) => {

  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  // Clean up the URL when a new file is selected or when the component unmounts
  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

    return (
        <div className={drop && auth_state === "login" ? "curtain drop_curtain login_curtain": drop && auth_state === "sign_up" ? "curtain drop_curtain sign_curtain": "curtain close_curtain"}>
  {
        auth_state === "login" && (
        <div className="input-container">
          <div className="input-field">
            <input type="email" placeholder="Enter your emails" />
          </div>
          <div className="input-field">
            <input type="password" placeholder="Enter your password" />
          </div>

          <button className="apple-button">
          <span className="apple-icon"><FcGoogle/> </span> Sign in with Google
        </button>
        </div>
  
        )
  }
  {
    auth_state === "sign_up" && (
        <div className="input-container">
      
              {imageSrc ? (
              <div className='profile_pic'>
              <img src={imageSrc} alt="Uploaded preview" style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '5px', borderRadius: "50%" }} /></div>
            ) : (
              <div className='profile_pic'>
              <Image src={Pr} alt="Uploaded preview" style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '5px', borderRadius: "50%", border: "1px solid #fff"}} /></div>
            )}
      
              <div className="input-field">
                <label>Profile Picture:</label>
                <input type="file" onChange={handleImageUpload} />
              </div>


              <div className="input-field">
          <input type="text" placeholder="Enter your name" />
        </div>
        <div className="input-field">
          
          <input type="email" placeholder="Enter your email" />
        </div>
        <div className="input-field">
         
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="apple-button">
          <span className="apple-icon"><FcGoogle/> </span> Sign in with Google
        </button>
            </div>
    )
  }
      </div>
    )
}

export default DropdownForm;