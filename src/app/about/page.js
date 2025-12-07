"use client"
import { useState } from 'react';
import "./how-to-play.css";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa"
import Button from '../Components/syonit_button/about';


export default function HowToPlay() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 2/10
  const totalSlides = 4;

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
        details: ["Syonit!™ is a fast-paced, no-questions-asked multiplayer game where players respond only 'Yes' or 'No' within strict time limits. The game challenges critical thinking, speed, and instinct. Outsmarting the crowd by thinking differently is the ultimate path to victory. Each round eliminates the majority, leaving only the sharpest minds in play. The tension builds through every round until one final contestant remains. That last player is crowned the SYONAIRE™."],
    },
    {
        title: "HOW TO PLAY SYONIT",
        details: [
      "Registration: Each player registers before the game begins.",
      "Mandatory Prize Selection: At registration, every player must select a prize from the prize pool without knowing the limited quantities.",
      "Minimum of 3 players are required to start a game.",
      "Each round consists of three opportunities: Chance™, Choice™, and Strategy™.",
      "Players respond with only “Yes” or “No” within the strict time limit.",
      "After each opportunity, all choices are revealed before moving to the next.",
      "Prize Scarcity Reveal: After the first opportunity (Chance™), the limited prize quantities are revealed through infographics, and players are given a free chance to switch prizes if desired.",
      "The minority batch earns points (10 pts each in the standard format).",
      "Players with the highest cumulative points advance to the next round.",
      "The majority batch is frozen and eliminated at the end of the round.",
"If the minority advancing is an even number, the Break-the-Tie Joker™ alarm gives one frozen majority player a chance to return.",
"Play continues through individual, duo, and trio Tournamusements™.",
"The last remaining player is crowned the SYONAIRE™"
        ]
    },
    {
        title: "Benefits of Playing Syonit",
        details: [
          "Builds critical thinking under pressure",
          "Encourages creative decision-making",
          "Trains quick judgment and reduces procrastination",
          "Engages individuals, duos, and trios in dynamic rounds",
          "Minimum of 3 players required to start a game"
        ]
    },
     {
        title: "Key Differenting Features Of Syonit",
        details: [
    "No-questions-asked Yes/No gameplay",
    "Three opportunities per round: Chance™, Choice™ & Strategy™",
      "Players advance by being in the minority batch",
      "Individual, Duo, and Trio Tournamusements™",
      "Break-the-Tie Joker™ for frozen majority comeback",
      "Sound-proof transparent glass box with frosted timer panels",
      "Visual revelation of team discussions (live show feature)",
      "Feedback discussion after each Tournamusement™",
      "Minority batch scores 10 pts per opportunity",
      "Players can also accumulate points toward prizes",
      "Banking system retains 29% when saving points",
      "Limited prize quantities revealed after Chance"
        ]
    }
  ];

  return (
    <div className="aboutContainer">
      <div className="iconContainer">
        <img src="/Icon.png" alt="icon" className="logo" />
      </div>
      <h1 className="aboutHeader">SYONIT</h1>
      <h2 className="subheader">HOW TO PLAY</h2>
      <div className="slider-container">
        <div className="slider-content">
          <div className='slider-inner-content'>
          <h1>{slides[currentSlide - 1].title}</h1>
          <ul>
            {
                slides[currentSlide - 1].details.map((item, key) => (
                    <li key={key}>{item}</li>
                ))
            }
          </ul>
          </div>
          <span className="progress-text">{`${currentSlide}/${totalSlides}`}</span>
        </div>
        <div className="about-slider-progress">
          <div className="about-progress-bar">
            <div
              className="about-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        
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
        <h1>Are You Ready To Proceed?</h1>
        <Button/>
      </div>

    </div>
  );
}