export const styles = {
       modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 9999,
      backdropFilter: 'blur(4px)'
    },
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef3c7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    homepageContent: {
      textAlign: 'center'
    },
    homepageTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    homepageText: {
      color: '#6b7280'
    },
    modalWrapper: {
      width: '100%',
      maxWidth: '40rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(to right, #f97316, #f59e0b)',
      padding: '1.5rem',
      color: 'white',
      position: 'relative'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem'
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      letterSpacing: '0.05em'
    },
    headerSubtitle: {
      textAlign: 'center',
      fontSize: '0.875rem',
      opacity: 0.9,
      fontFamily: 'Heebo, sans-serif'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    content: {
      padding: '1.5rem'
    },
    contentHeader: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      fontWeight: 700,
      fontFamily: "Heebo, sans-serif",
      letterSpacing: '1.8px'
    },
    contentTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    contentSubtitle: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    prizeList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxHeight: '24rem',
      overflowY: 'auto',
      paddingRight: '0.5rem'
    },
    prizeCard: {
      position: 'relative',
      padding: '1rem',
      borderRadius: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    prizeCardHover: {
      transform: 'scale(1.05)'
    },
    prizeCardSelected: {
      boxShadow: '0 0 0 4px white, 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transform: 'scale(1.05)'
    },
    prizeContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    iconWrapper: {
      width: '4rem',
      height: '4rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    prizeInfo: {
      flex: 1,
      color: 'white'
    },
    prizeName: {
      fontWeight: 700,
      fontFamily: "Heebo, sans-serif",
      letterSpacing: '1.5px',
      marginBottom: '0.25rem',
      fontSize: '1.125rem'
    },
    prizeMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    difficultyBadge: {
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontWeight: '500'
    },
    estimatedGames: {
      fontSize: '0.75rem',
      opacity: 0.9
    },
    pointsWrapper: {
      textAlign: 'right'
    },
    pointsValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white'
    },
    pointsLabel: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: 700,
      fontFamily: "Heebo, sans-serif",
      letterSpacing: '1.8px'
    },
    progress: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.6)',
      marginTop: '0.25rem'
    },
    checkmark: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      width: '2rem',
      height: '2rem',
      background: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkmarkInner: {
      width: '1.25rem',
      height: '1.25rem',
      background: '#22c55e',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 'bold'
    },
    buttonWrapper: {
      marginTop: '1.5rem'
    },
    confirmButton: {
      width: '100%',
      padding: '1rem',
      borderRadius: '0.75rem',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    confirmButtonEnabled: {
      background: 'linear-gradient(to right, #22c55e, #10b981)',
      color: 'white'
    },
    confirmButtonDisabled: {
      background: '#d1d5db',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    warningText: {
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.5rem'
    },
    successCard: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '28rem',
      textAlign: 'center',
      animation: 'pulse 2s ease-in-out infinite'
    },
    successIcon: {
      width: '5rem',
      height: '5rem',
      background: 'linear-gradient(135deg, #4ade80, #10b981)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem'
    },
    successTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    successSubtitle: {
      color: '#6b7280',
      marginBottom: '1rem'
    },
    successPoints: {
      fontSize: '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #9333ea, #db2777)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    successFooter: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      marginTop: '1rem'
    }
  };