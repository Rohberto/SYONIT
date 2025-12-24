'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import './success.css';

export default function RegistrationSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/profile');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="success-container">
      <Confetti numberOfPieces={220} recycle={false} />

      <h1 className="success-title">🎉 Registration Successful!</h1>

      <p className="success-text">
        Welcome to <span>SYONIT</span>.  
        Get ready to make smart decisions and win.
      </p>

      <p className="redirect-text">Redirecting to homepage…</p>
    </div>
  );
}
