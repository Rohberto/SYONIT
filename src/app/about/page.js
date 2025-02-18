import React from 'react';
import "./About.css";
import Header from '../Components/MainHeader/mainHeader';


const About = () => {
  return (
    <div className='about_container'>
      <Header/>
        <div className='about_header'>
           <h1>About Us</h1>
        </div>

        <div className='about_description_container'>
        <p>
        <b>SYONIT</b> (Simple Yes or No Interactive Tourna-musement.) 
        is a fast-paced, prize-based multiplayer tourna-musement, 
        where decision-making is everything. 
        Players compete in real-time by selecting Yes or No in a series of elimination rounds, 
        with the goal of being in the minority to win.
    <br/>
    <br/>
        Each game room has an entry fee and a prize pool, 
        making every round an exciting test of strategy, 
        intuition, and risk-taking. 
        The last player standing after the elimination rounds is crowned the <b>$YO₦AIR£</b>,
         claiming the grand prize.
         <br/>
         <br/>
         <b>SYONIT</b> is not just a game—it’s an <b>interactive decision-making challenge</b> 
         that rewards bold choices and quick thinking. 
         Whether you’re playing for fun, competition, 
         or the thrill of the prize, 
         <b>SYONIT</b> delivers a unique and engaging experience every time.
         </p>
        </div>

        <div className='about_header'>
           <h1>OUR HISTORY</h1>
        </div>

        <div className='about_description_container'>
        <p>
        <b>SYONIT</b> was founded in 2024 by <b>Engr. Goke Osibodu</b>, 
        with a vision to create an interactive 
        decision-making challenge that blends fun, 
        competition, and strategy.
         Currently in development, 
         SYONIT is being built to provide a unique
          and engaging multiplayer experience,
           where players can test their instincts 
           and strategic thinking while competing 
           for exciting prizes.
           <br/>
           <br/>

As we prepare for launch, our goal is to deliver a thrilling, real-time gaming experience that will challenge players worldwide. Stay tuned for updates as we bring SYONIT to life!
        </p>
        </div>

    </div>
  )
}

export default About;