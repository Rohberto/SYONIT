"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
const TournamentContext = createContext();

export const TournamentProvider = ({children}) => {
const [gameTimer, setGameTimer] = useState(0);
    return (
        <TournamentContext.Provider value={{gameTimer, setGameTimer}}>
                {children}
        </TournamentContext.Provider>
    )
}

export const useTournament = () => useContext(TournamentContext);