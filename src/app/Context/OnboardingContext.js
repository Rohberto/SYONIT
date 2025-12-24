"use client";
import { createContext, useContext, useRef, useState } from 'react';

const OnboardingContext = createContext(null);

const START_DELAY = 2000;

export function OnboardingProvider({ children }) {
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // ✅ delay ref lives here
  const delayRef = useRef(null);

  const start = (newSteps) => {
    setSteps(newSteps);
    setStepIndex(0);

    // clear previous delay if any
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }

    delayRef.current = setTimeout(() => {
      setVisible(true);
    }, START_DELAY);
  };

  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {

      close();
    }
  };

  const close = () => {
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }

    setVisible(false);
    setSteps([]);
    setStepIndex(0);
  };

  return (
    <OnboardingContext.Provider
      value={{
        steps,
        stepIndex,
        visible,
        start,
        next,
        close,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
