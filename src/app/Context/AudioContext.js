"use client"
import { createContext, useContext, useRef } from "react";

const AudioContext = createContext();

export const AudioProvider = ({children}) => {
    const audioRef = useRef(null);
      const clock = useRef(null);

    return (
        <AudioContext.Provider value={{audioRef, clock}}>
            {children}
        </AudioContext.Provider>
    )
}
export const useAudio = () => useContext(AudioContext);