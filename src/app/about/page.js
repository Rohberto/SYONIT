"use client"
import { useState } from 'react';
import "./how-to-play.css";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa"
import Button from '../Components/syonit_button/about';


export default function HowToPlay() {
  const [currentSlide, setCurrentSlide] = useState(2); // Start at 2/10
  const totalSlides = 3;

  const handlePrev = () => {
    if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
  };

  const progressPercentage = (currentSlide / totalSlides) * 100;

  // Static content for each slide
  const slides = [
    {
        title: "ABOUT SYONiT",
        details: ["SYONIT (Simple Yes or No Interactive Tourna-musement.) is a fast-paced, prize-based multiplayer mind game tourna-musement, players must think critically and make lightning-quick Yes or No decisions. The key to winning? Thinking differently! This thrilling game challenges your ability to adapt, strategize, and outthink your opponents in a race against time.", "YONIT</b> is not just a game—it’s an interactive decision-making challenge that rewards bold choices and quick thinking.Whether you’re playing for fun, competition, or the thrill of the prize", 
         "SYONIT delivers a unique and engaging experience every time."],
    },
    {
        title: "HOW TO PLAY SYONIT",
        details: [
            "Pick a Prize - At the beginning of the game you are expected to pick a prize.",
            "Join A Room - Enter a room with other players to compete for points that would be use to redeem your prize",
            "Wait for Game Start - When the timer ends, no new players can join that room.",
            "Choose Yes or No - Make your decisions each round, you are expected to be in the minority to win.",
            "Top the Leaderboard - After 3 opportunities, the players with the most points advance to the next round."

        ]
    },
    {
        title: "Benefits of Playing Syonit",
        details: [
            "Improves Critical Thinking - SYONit! requires players to think critically and make quick decisions, which can help improve their critical thinking skills.",
            "Enhance Creativity -  By encouraging players to think differently, SYONit! can help improve creative thinking and problem-solving skills.",
            "Boosted Cognitive Flexibility -  The game's fast-paced nature and unpredictable gameplay can help improve cognitive flexibility, which is the ability to adapt to new information and situations.",
            "Better Decision Making - SYONit! requires players to make quick decisions, which can help improve decision-making skills and reduce analysis paralysis.",
            "Fun and Engaging - Most importantly, SYONit! is a fun and engaging game that can provide hours of entertainment and enjoyment!"
        ]
    }
  ];

  return (
    <div className="aboutContainer">
      <h1 className="aboutHeader">SYONIT</h1>
      <h2 className="subheader">HOW TO PLAY</h2>
      <div className="slider-container">
        <div className="slider-content">
          <h1>{slides[currentSlide - 1].title}</h1>
          <ul>
            {
                slides[currentSlide - 1].details.map((item, key) => (
                    <li key={key}>{item}</li>
                ))
            }
          </ul>
        </div>
        <div className="slider-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">{`${currentSlide}/${totalSlides}`}</span>
        </div>
        <div className="nav-buttons">
          <button
            className="nav-button"
            onClick={handlePrev}
            disabled={currentSlide <= 1}
          >
           <FaArrowLeft/>
          </button>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentSlide >= totalSlides}
          >
           <FaArrowRight/>
          </button>
        </div>
      </div>

      <div className="ButtonContainer">
             <Button/>
      </div>

   
    </div>
  );
}