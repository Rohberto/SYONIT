// GameInviteFeature.jsx
import React, { useState, useEffect } from 'react';
import styles from './GameInviteFeature.module.css';

export default function GameInviteFeature({showShareModal, setShowShareModal}) {
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({ 
    invites: 0, 
    joined: 0, 
    pointsEarned: 0,
    pending: 0 
  });
  const [userReferralCode, setUserReferralCode] = useState('');
  
  // Load user's referral code and stats on mount
  /*useEffect(() => {
    loadUserReferralData();
  }, []);*/
  
  const loadUserReferralData = async () => {
    try {
      const userId = "syonit"; // Replace with: auth.currentUser.id
      
      // Fetch user's unique referral code
      const codeResponse = await fetch(`/api/referrals/code/${userId}`);
      const codeData = await codeResponse.json();
      setUserReferralCode(codeData.referralCode);
      
      // Fetch referral stats
      const statsResponse = await fetch(`/api/referrals/stats/${userId}`);
      const statsData = await statsResponse.json();
      
      setReferralStats({
        joined: statsData.stats.completed_referrals || 0,
        invites: statsData.stats.total_referrals || 0,
        pointsEarned: statsData.totalPointsEarned || 0,
        pending: statsData.stats.pending_referrals || 0
      });
    } catch (error) {
      console.error('Error loading referral data:', error);
      // Fallback for demo
      setUserReferralCode('SYON123ABC');
      setReferralStats({ joined: 2, invites: 5, pointsEarned: 250, pending: 3 });
    }
  };
  
  // Generate unique referral code for current user
  const gameUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${userReferralCode}`;
  const inviteMessage = "Join me for a game on SYONIT! 🎮 Click here to play:";
  
  const handleShare = async (platform) => {
    const encodedMessage = encodeURIComponent(inviteMessage);
    const encodedUrl = encodeURIComponent(gameUrl);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=Join me on SYONIT&body=${encodedMessage}%20${encodedUrl}`,
      sms: `sms:?body=${encodedMessage}%20${encodedUrl}`
    };
    
    if (shareUrls[platform]) {
      // Track invite attempt (optional - backend can track when someone actually signs up)
      try {
        await fetch('/api/referrals/track-share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: "syonit", // Replace with auth.currentUser.id
            platform: platform,
            referralCode: userReferralCode
          })
        });
      } catch (error) {
        console.log('Share tracking failed:', error);
      }
      
      // Open share dialog
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${inviteMessage} ${gameUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const shareOptions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'whatsapp' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', color: 'telegram' },
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'twitter' },
    { id: 'facebook', name: 'Facebook', icon: 'f', color: 'facebook' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'linkedin' },
    { id: 'email', name: 'Email', icon: '✉️', color: 'email' },
    { id: 'sms', name: 'SMS', icon: '💬', color: 'sms' }
  ];

  return (
    <>
     {/* Share Modal */}
      {showShareModal && (
        <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Invite Friends</h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className={styles.closeBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <p className={styles.modalDescription}>
              Share this game with your friends and play together!
            </p>
            
            {/* Referral Stats */}
            <div className={styles.referralStats}>
              <p className={styles.statsTitle}>Your Invite Stats</p>
              <div className={styles.statsRow}>
                <div>
                  <p className={`${styles.statValue} ${styles.joined}`}>{referralStats.joined}</p>
                  <p className={styles.statLabelSmall}>Joined</p>
                </div>
                <div>
                  <p className={`${styles.statValue} ${styles.pending}`}>{referralStats.pending}</p>
                  <p className={styles.statLabelSmall}>Pending</p>
                </div>
                <div>
                  <p className={`${styles.statValue} ${styles.points}`}>{referralStats.pointsEarned}</p>
                  <p className={styles.statLabelSmall}>Points</p>
                </div>
              </div>
            </div>
            
            {/* Share Options Grid */}
            <div className={styles.shareGrid}>
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className={`${styles.shareBtn} ${styles[option.color]}`}
                >
                  <span className={styles.shareIcon}>{option.icon}</span>
                  <span className={styles.shareName}>{option.name}</span>
                </button>
              ))}
            </div>
            
            {/* Copy Link Section */}
            <div className={styles.copySection}>
              <p className={styles.copyLabel}>Or copy invite link:</p>
              <div className={styles.copyInputGroup}>
                <input 
                  type="text" 
                  value={gameUrl}
                  readOnly
                  className={styles.copyInput}
                />
                <button
                  onClick={copyToClipboard}
                  className={`${styles.copyBtn} ${copied ? styles.copied : styles.default}`}
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}