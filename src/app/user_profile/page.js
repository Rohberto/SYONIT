import React from 'react';
import "./profile.css";
import Header from '../Components/MainHeader/mainHeader';


const page = () => {
    const userData = {firstName: "Robert", lastname: "Oluwaseun", Email: "oluwaseunRobert44@gmail.com", DOB: "4th of August", Address: "omole Estate, Ojodu Berger"}
  return (
    <div className='user_profile'>
        <Header/>
        <div className='user_profile_photo'>
            <img src='/user.png' alt='user image'/>
        </div>

        <div className='user_profile_details'>
           {
            Object.keys(userData).map((item, index) => (
                <div className='profile_container' key={index}>
                    <h3>{item}</h3>
                    <p>{userData[item]}</p>
                </div>
            ))
           }
        </div>

        <div className='Edit_button_container'>
            <button>Edit Profile</button>
        </div>
    </div>
  )
}

export default page;