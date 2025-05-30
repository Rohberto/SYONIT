"use client"
import { useState, useEffect } from 'react';
import Header from '../Components/MainHeader';
import Button from '../Components/syonit_button/inviteButton';
import "./page.css";

export default function Invite() {
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([
    { name: 'Sarah', status: 'inGame', points: '2,000 PT' },
    { name: 'Sarah', status: 'readied', points: '2,000 PT' },
    { name: 'Sarah',  points: '2,000 PT' },
    { name: 'Chris',  points: '2,000 PT' },
    { name: 'Chris', status: 'friend', points: '' },
    { name: 'Chris', status: 'friend', points: '' },
  ]);
  const [timeLeft, setTimeLeft] = useState(750); // 12:30 in seconds (12*60 + 30)

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendInvite = () => {
    if (email) {
      alert(`Invite sent to ${email}`);
      setEmail('');
    }
  };

  const handleBack = () => {
    // Navigate back to home (implement navigation logic as needed)
    alert('Back to Home');
  };

  return (
    <div className="inviteContainer">
 <Header/>
      <h2 className="subheader">INVITE</h2>
      <div className="invite-container">
        <div className='searchButton'>
          <input placeholder='Search' type='text' />
        </div>
        <div className="friend-section">
          <div className="tab-buttons">
            <button className="tab-button active">Friends</button>
            <button className="tab-button">Online</button>
          </div>
          {friends.map((friend, index) => (
            <div key={index} className="friend-item">
              <span className="friend-name">{friend.name}</span>
              <div className='extra-info'>
              <span
                className={`status ${friend.status === 'inGame' ? 'in-game' : friend.status === 'readied' ? 'readied' : ''}`}
              >
                {friend?.status === 'inGame' && 'IN GAME'}
                {friend?.status === 'readied' && 'READIED'}
                {friend?.status === 'friend' && <span className='add-friend'>+ Friend</span>}
              </span>
             {friend?.points && <span className="points">{friend.points}</span>}
              {
                friend?.status !== "friend" && (
                  <span className={`status-circle ${friend?.status === 'inGame' ? 'status-active' : friend?.status === 'readied' ? 'status-active' : ''}`}></span>
                )
              }
              </div>
            </div>
          ))}
        </div>
      </div>

           <div className="email-input">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to invite to SYONIT"
          />
          <button className="send-button" onClick={handleSendInvite}>
            SEND
          </button>
        </div>

      <div className="bottom-button">
      <Button formatTime={formatTime} timeLeft={timeLeft}/>
      </div>
    </div>
  );
}