"use client"
import React from 'react';
import { FaBook, FaBookOpen, FaFlagCheckered, FaHandsHelping, FaLightbulb, FaRegUser, FaUser } from 'react-icons/fa';
import {BsBook} from "react-icons/bs";
import { FcIdea } from 'react-icons/fc';
import Header from '../Components/MainHeader';
import Button from '../Components/syonit_button/mainButton';
import { useUser } from '../Context/userContext';
import { useSocket } from '../Context/SocketContext';

const page = () => {
      const {socket, tournament, setTournament, noOfPlayers, setNoOfPlayers, timeLeft, formatTime} = useSocket();
      const {user} = useUser();

  return (
    <div className="gameContainer">
    <div className='glassy-panel'>
      <Header/>
   
     
      <div className="bottom-button">
      <div className='game_details'>
        <p>ONLINE: 3</p>
        <p>1: IN GAME</p>
      </div>

      {<Button formatTime={formatTime} timeLeft={timeLeft} tournament={tournament} user={user} />}
      </div>
      </div>
    </div>
  );
}

export default page;