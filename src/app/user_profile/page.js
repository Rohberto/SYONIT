import React from 'react';


const page = () => {
    const userData = {firstName: "Robert", lastname: "Oluwaseun", Email: "oluwaseunRobert44@gmail.com", DOB: "4th of August", Address: "omole Estate, Ojodu Berger"}
  return (
    <div className='user_profie'>
        <div className='user_profile_photo'>
            <img src='' alt='user image'/>
        </div>

        <div className='user_profile_details'>
           {
            Object.keys(userData).map((item, index) => (
                <div className='profile_container'>
                    <h3>{item}</h3>
                    <p>{userData[item]}</p>
                </div>
            ))
           }
        </div>
    </div>
  )
}

export default page;