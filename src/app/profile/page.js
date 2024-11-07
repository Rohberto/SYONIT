"use client"
import React, {useState, useEffect} from 'react'
import Header from '../Components/Header'
import Bottom from '../Components/profileBottom';
import Image from 'next/image';
import Pr from "../Assets/pr.png";
import "./profile.css";
const Profile = () => {
  

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
    <div className='container'>
        <Header/>

        <div className="input-container">

        {imageSrc ? (
        <div className='profile_pic'>
        <img src={imageSrc} alt="Uploaded preview" style={{ width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px', borderRadius: "50%" }} /></div>
      ) : (
        <div className='profile_pic'>
        <Image src={Pr} alt="Uploaded preview" style={{ width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px', borderRadius: "50%", border: "1px solid #fff"}} /></div>
      )}

        <div className="input-field">
          <label>Profile Picture:</label>
          <input type="file" onChange={handleImageUpload} />
        </div>
      </div>


        <Bottom/>
    </div>
  )
}

export default Profile
