"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(false);
    const [prize, setPrize] = useState(null);
    const prizes = [
        { id: 1, prize: "/camera.jpg", points: 30 },
        { id: 2, prize: "/car.jfif", points: 20 },
        { id: 3, prize: "/laptop.jfif", points: 25 },
        { id: 4, prize: "/phone.jpg", points: 15 },
        { id: 5, prize: "/tv.webp", points: 30 }
      ];
    const slides = [
        { id: 1, image: "/quote.jpg", points: 30 },
        { id: 2, image: "/quote1.jpg", points: 20 },
        { id: 3, image: "/quote2.jpg", points: 25 }
      ];

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
        <UserContext.Provider value={{user, setUser, prize, setPrize, prizes}}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => useContext(UserContext);