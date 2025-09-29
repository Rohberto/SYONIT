"use client"
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [prize, setPrize] = useState(null);

  const prizes = [
    { id: 1, prize: "/camera.jpg", points: 30 },
    { id: 2, prize: "/car.jfif", points: 20 },
    { id: 3, prize: "/laptop.jfif", points: 25 },
    { id: 4, prize: "/phone.jpg", points: 15 },
    { id: 5, prize: "/tv.webp", points: 30 }
  ];

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedPrize = localStorage.getItem("prize");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedPrize) {
      try {
        setPrize(JSON.parse(storedPrize));
      } catch {
        setPrize(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, prize, setPrize, prizes, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
