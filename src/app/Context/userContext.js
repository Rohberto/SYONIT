"use client";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [prize, setPrize] = useState(null);
  const [userPrize, setUserPrize] = useState(null);
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrize, setSelectedPrize] = useState(null);

  // Load from storage first
  useEffect(() => {
    const loadFromStorage = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedPrize = localStorage.getItem("userPrize");

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
        setUserPrize(JSON.parse(storedPrize));
      }
      setLoading(false);
    };

    loadFromStorage();
  }, []);

  // Fetch prizes AFTER token is loaded - add [token] to dependency array
  useEffect(() => {
    // Only fetch if token exists
    if (!token) {
      console.log("No token available yet, skipping prize fetch");
      return;
    }

    const fetchPrizes = async () => {
      try {
        setLoading(true);
        console.log("Fetching prizes with token:", token);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/prizes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", data);
        
        if (response.ok) {
          console.log("Setting prizes:", data.prizes);
          setPrizes(data);
        } else {
          console.error("API Error:", data);
        }
      } catch (err) {
        console.error("Error fetching prizes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, [token]); // Add token as dependency!

  useEffect(() => {
    // get selected prize from prizes list
    if (prizes && userPrize) {
      const matchedPrize = prizes.find(p => p.id === userPrize.prizeId);
      setSelectedPrize(matchedPrize || null);
    }
  }, [prizes, userPrize]);
   

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        prize, 
        setPrize, 
        prizes, 
        token, 
        setToken, 
        loading, 
        userPrize, 
        setUserPrize, 
        setPrizes ,
        selectedPrize,
        setSelectedPrize
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);