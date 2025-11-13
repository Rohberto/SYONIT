import React from 'react';
import Header from '../Components/MainHeader/mainHeader';
import "./play.css";
const page = () => {
  return (
    <div className='play_container'>
        <Header/>
        <h1 className='play_header'>
            HOW TO PLAY SYONIT
        </h1>

        <ul className='game_process'>
            <li className='main_list'>Join a game room
                <ul className='play_list'>
                    <li>Players must have subscribed to play the game.</li>
                    <li>Each Room has a prize, you select the prize you want to play for.</li>
                    <li>Once you joins, a countdown timer starts before the game begins.</li>
                </ul>
            </li>
            <li className='main_list'>Make Your Decision
                <ul className='play_list'>
                    <li>Each round, players choose between Yes or No by clicking a button..</li>
                    <li>Your goal is to be in the minority—only those who pick the least chosen option win the round.</li>
                </ul>
            </li>
            <li className='main_list'>Score Points & Advance
                <ul className='play_list'>
                    <li>Players in the minority earn points for the round.</li>
                    <li>The game consists of three rounds, and players with the highest points progress to the next stage.</li>
                </ul>
            </li>
            <li className='main_list'>Elimination & Winning
                <ul className='play_list'>
                    <li>After multiple rounds, the last player standing is the Syonaire—the winner of the game!</li>
                    <li>The Syonaire claims the prize pool and earns bragging rights.</li>
                </ul>
            </li>
        </ul>
    </div>
  )
}

export default page
