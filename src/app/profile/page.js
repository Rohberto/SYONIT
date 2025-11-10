"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./profile.css";
import { getAudioContext, playSound } from '../libs/audioContext';
import { useUser } from '../Context/userContext';
export default function Welcome() {
  const [profileImage, setProfileImage] = useState(null);
  const [clickBuffer, setClickBuffer] = useState(null);
  const router = useRouter();
  const {user} = useUser();

  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const loadSound = async () => {
      try {
        const clickResponse = await fetch('/Sounds/coin_drop.mp3');
        if (!clickResponse.ok) throw new Error('Failed to fetch coin_drop.mp3');
        const clickArrayBuffer = await clickResponse.arrayBuffer();
        const clickAudioBuffer = await ctx.decodeAudioData(clickArrayBuffer);
        setClickBuffer(clickAudioBuffer);
      } catch (err) {
        console.error('Error loading sounds:', err);
      }
    };

    loadSound();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview locally
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Syonit"); // from cloudinary dashboard

      const res = await fetch("https://api.cloudinary.com/v1_1/dxurv6mps/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        console.log("Uploaded Image URL:", data.secure_url);

        // Send URL to backend to update user
      const res =  await fetch("https://syonit-js.onrender.com/api/profile", { // change endpoint
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id, // assuming you saved after signup
            image_url: data.secure_url,
          }),
        });
      }
      if(res.ok){
       alert("Image updated successfully");
      }
       router.push("/Home");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("error uploading image");
    }
  };

  return (
    <div className="profileContainer">
      <h1 className="profileHeader">SYONIT</h1>
      <h2 className="subheader">WELCOME SYONNAIRE JOHN!</h2>

      <div className="profile-container">
        <div className="profile-picture">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <div className="placeholder"></div>
          )}
        </div>

        <label htmlFor="image-upload" className="upload-label">
          UPDATE PROFILE PICTURE
          <hr/>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      <div className='bottom-button'>
        <button className="profile-button" onClick={() => {
          playSound(clickBuffer, '/Sounds/coin_drop.mp3');
          router.push("/Home");
        }}>
          LET'S GET STARTED
        </button>
      </div>
    </div>
  );
}
