"use client";
import { useEffect, useState } from "react";
import "./slidingQuotes.css";

const QUOTES = [
  {
    text: "The World accomodates you for fitting in, but only rewards you for standing out.",
    author: "Matshona Dhliwayo",
  },
  {
    text: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.",
    author: "Mark Twain",
  },
   {
    text: "If you always do what others are doing, you will never do better than others.",
    author: "African Proverb",
  },
  {
    text: "Life is a series of choices. You make them, and they make you.",
    author: "John C. Maxwell",
  },
  {
    text: "Indecision is the thief of opportunity.",
    author: "Jim Rohn",
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
  },
  {
    text: "The risk of a wrong decision is preferable to the terror of indecision.",
    author: "Maimonides",
  },
  {
    text: "The reasonable man adapts himself to the world; the unreasonable one persists in trying to adapt the world to himself.",
    author: "George Bernard Shaw",
  },

];

export default function SlidingQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const { text, author } = QUOTES[index];

  return (
    <div className="quotes-wrapper">
      <div key={index} className="quote-slide">
        <p className="quote-text">“{text}”</p>
        <span className="quote-author">— {author}</span>
      </div>
    </div>
  );
}
