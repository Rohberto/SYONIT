import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedText() {
  const textRef = useRef(null);

  useEffect(() => {
    // Create a GSAP timeline
    const tl = gsap.timeline();

    tl.fromTo(
      ".never_give_up",
      { scale: 0.8, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: 2, ease: "power1.out" }
    )
      .to(".never_give_up", {
        scale: 1,
        duration: 0.3,
        ease: "power1.inOut"
      })
      .fromTo(".rest_of_text",   { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power1.out" });
  }, []);

  return (
    <p className="frozen_motivation" ref={textRef}>
      <span className="never_give_up">Never give up!</span>{" "}
      <span className="rest_of_text">
        You can still join the game if you stay alert to <b>Break-the-Tie.</b>{" "}
        Fastest finger joins next round.
      </span>
    </p>
  );
}
