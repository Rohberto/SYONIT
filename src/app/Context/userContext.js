"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(false);
    const [prize, setPrize] = useState(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem("user");
        const savedPrize = localStorage.getItem("prize");
        if (savedUsername) {
            setUser(savedUsername);
        }
        if(savedPrize){
            setPrize(savedPrize);
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, prize, setPrize}}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => useContext(UserContext);