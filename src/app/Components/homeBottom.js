import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Bottom = ({handleJoinGame, isLoading, gameplaySoundRef}) => {
  const router = useRouter();
  useEffect(() => {
    const canvas = document.getElementById("siriCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to fit the window
    canvas.width = 80;
    canvas.height = 80;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150; // Radius of the circular animation
    const gradientHeight = 600; // Vertical height of the gradient
    let offset = 0; // Controls the vertical movement

    function drawVerticalGradient() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a vertical gradient
      const gradient = ctx.createLinearGradient(
        centerX,
        centerY - gradientHeight / 2 - offset,
        centerX,
        centerY + gradientHeight / 2 - offset
      );
      gradient.addColorStop(0, "rgba(236, 193, 110, 0)");
      gradient.addColorStop(0.16, "rgba(154, 47, 14, 0)");
      gradient.addColorStop(0.33, "rgba(255, 180, 0, 0.84)");
      gradient.addColorStop(0.5, "#FFBB0D");
      gradient.addColorStop(0.66, "#F4E596");
            gradient.addColorStop(1, "#FFBB0D");


      // Draw the circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Update the vertical offset
      offset = (offset + 2) % gradientHeight; // Loop the gradient

      requestAnimationFrame(drawVerticalGradient);
    }

    drawVerticalGradient();
  }, []);
  return (
    <div className='home_bottom mainBottomContainer'>
         <div className='main-button-container'>
    <div className='buttonsContainer'>
      <Link href={"/invite"} className='onboarding_link onboarding_link_login onboarding_left'>Invite Friends</Link>
      <button className='onboarding_link onboarding_button onboarding_link_sign onboarding_right'  onClick={() => {router.push("/game");
        gameplaySoundRef.current.play();
      }}>Join Next Game</button>
      <canvas className='button_circle' id="siriCanvas"></canvas>
    </div>
    </div>
    </div>
  )
}

export default Bottom;
