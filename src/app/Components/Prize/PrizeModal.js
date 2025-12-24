"use client";
import React, { useState, useEffect } from 'react';
import { Gift, Trophy, Headphones, Gamepad2, Shirt, X, Sparkles } from 'lucide-react';
import { useUser } from '@/app/Context/userContext';
import { getIconForPrize, getColorForPrize } from '@/utils/prize';
import { styles } from './styles';
import { useSocket } from '@/app/Context/SocketContext';

const PrizeSelectionUI = ({onClose}) => {
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
const { prizes, loading, user } = useUser();
const [tPrizes, setPrizes] = useState([]);
const {handleReadyUp, tournament, handleSendPrize} = useSocket();
/*
  const prizes = [
    {
      id: 1,
      name: "Gaming Console",
      points: 100,
      icon: Gamepad2,
      difficulty: "hard",
      estimatedGames: "20-25 games",
      color: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
    },
    {
      id: 2,
      name: "Wireless Headphones",
      points: 60,
      icon: Headphones,
      difficulty: "medium",
      estimatedGames: "12-15 games",
      color: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
    },
    {
      id: 3,
      name: "Gift Card",
      points: 50,
      icon: Gift,
      difficulty: "medium",
      estimatedGames: "10-12 games",
      color: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
    },
    {
      id: 4,
      name: "SYONIT T-Shirt",
      points: 20,
      icon: Shirt,
      difficulty: "easy",
      estimatedGames: "4-5 games",
      color: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)"
    }
  ];
*/

const calculateDifficulty = (points) => {
    if (points <= 30) return 'easy';
    if (points <= 70) return 'medium';
    return 'hard';
  };

useEffect(() => {
  console.log("Prizes from context:", prizes);

      const transformedPrizes = prizes?.map((prize, index) => ({
        id: prize.id,
        name: prize.name,
        points: prize.pointsRequired,
        icon: getIconForPrize(prize.name), // Dynamically picks icon based on name
        difficulty: calculateDifficulty(prize.pointsRequired),
        estimatedGames: `${Math.floor(prize.pointsRequired / 5)}-${Math.ceil(prize.pointsRequired / 4)} games`,
        color: getColorForPrize(index), // Cycles through color palette
        imageUrl: prize.imageUrl // Store this if you want to use real images instead
      }));
      setPrizes(transformedPrizes);
  
}, [prizes]);

  const handleSelectPrize = (prize) => {
    console.log("Selected prize:", prize);
    setSelectedPrize(prize);
  };

  const handleConfirm = () => {
    if (!selectedPrize) return;
  handleSendPrize(user.id, selectedPrize.id, setConfirmed, onClose);
  };

  const getDifficultyStyle = (difficulty) => {
    switch(difficulty) {
      case 'easy': 
        return { color: '#4ade80', backgroundColor: 'rgba(34, 197, 94, 0.2)' };
      case 'medium': 
        return { color: '#facc15', backgroundColor: 'rgba(234, 179, 8, 0.2)' };
      case 'hard': 
        return { color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.2)' };
      default: 
        return { color: '#9ca3af', backgroundColor: 'rgba(107, 114, 128, 0.2)' };
    }
  };



  

if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading prizes...</p>
        </div>
      </div>
    );
  }

 /* if (!showModal) {
    return (
      <div style={styles.container}>
        <div style={styles.homepageContent}>
          <h1 style={styles.homepageTitle}>SYONIT</h1>
          <p style={styles.homepageText}>Your homepage content goes here...</p>
        </div>
      </div>
    );
  }*/

  if (confirmed) {
    return (
      <div style={styles.modalOverlay}>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
          `}
        </style>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            <Trophy style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
          </div>
          <h2 style={styles.successTitle}>Prize Locked In!</h2>
          <p style={styles.successSubtitle}>You're playing for: {selectedPrize.name}</p>
          <div style={styles.successPoints}>
            {selectedPrize.points} Points
          </div>
          <p style={styles.successFooter}>Let's start playing!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalWrapper}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <Sparkles style={{ width: '1.5rem', height: '1.5rem' }} />
            <h1 style={styles.headerTitle}>SYONIT</h1>
            <Sparkles style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <p style={styles.headerSubtitle}>Choose Your Prize - Play to Win!</p>
          <button 
            style={styles.closeButton}
            onClick={() => onClose()}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <h2 style={styles.contentTitle}>Pick Your Prize</h2>
            <p style={styles.contentSubtitle}>You can only choose once - make it count!</p>
          </div>

          <div style={styles.prizeList}>
            {tPrizes?.map((prize) => {
              const Icon = prize.icon;
              const isSelected = selectedPrize?.id === prize.id;
              const difficultyStyle = getDifficultyStyle(prize.difficulty);
              
              return (
                <div
                  key={prize.id}
                  onClick={() => handleSelectPrize(prize)}
                  style={{
                    ...styles.prizeCard,
                    background: prize.color,
                    ...(isSelected && styles.prizeCardSelected)
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={styles.prizeContent}>

                    <div style={styles.iconWrapper}>
                    {prize.imageUrl ? (
                        <img 
                        src={prize.imageUrl} 
                        alt={prize.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }}
                        />
                    ) : (
                        <Icon style={{ width: '2rem', height: '2rem', color: '#1f2937' }} />
                    )}
                    </div>

                    <div style={styles.prizeInfo}>
                      <h3 style={styles.prizeName}>{prize.name}</h3>
                      <div style={styles.prizeMeta}>
                        <span style={{...styles.difficultyBadge, ...difficultyStyle}}>
                          {prize.difficulty.toUpperCase()}
                        </span>
                        <span style={styles.estimatedGames}>{prize.estimatedGames}</span>
                      </div>
                    </div>

                    <div style={styles.pointsWrapper}>
                      <div style={styles.pointsValue}>{prize.points}</div>
                      <div style={styles.pointsLabel}>POINTS</div>
                      <div style={styles.progress}>0/{prize.points}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={styles.checkmark}>
                      <div style={styles.checkmarkInner}>
                        <span>✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={styles.buttonWrapper}>
            <button
              onClick={handleConfirm}
              disabled={!selectedPrize}
              style={{
                ...styles.confirmButton,
                ...(selectedPrize ? styles.confirmButtonEnabled : styles.confirmButtonDisabled)
              }}
              onMouseOver={(e) => {
                if (selectedPrize) {
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedPrize) {
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {selectedPrize ? `Lock In ${selectedPrize.name}` : 'Select a Prize First'}
            </button>
            {selectedPrize && (
              <p style={styles.warningText}>
                This choice is permanent - you'll play to earn this prize!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeSelectionUI;