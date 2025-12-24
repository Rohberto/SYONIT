"use client";
import { useOnboarding } from '@/app/Context/OnboardingContext';
import { onboardingSteps } from '@/app/libs/onboardingSteps';
import { useEffect, useState } from 'react';
import Glass from '../GlassyButton/Glass';

export default function SpotlightOverlay() {
  const { visible, stepIndex, next, close, steps} = useOnboarding();
const step = steps[stepIndex];
const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!visible || !step) return;

    let raf1, raf2;

    const measure = () => {
      const el = document.querySelector(step.selector);
      if (!el) return;

      const r = el.getBoundingClientRect();
      if (r.width && r.height) setRect(r);
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure);
    });

    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener('resize', measure);
    };
  }, [visible, stepIndex]);

  if (!visible || !rect) return null;

  const tooltipWidth = 260;
const margin = 12;

let tooltipTop = rect.bottom + 12;
let tooltipLeft = rect.left + rect.width / 2;




// if bottom overflow → move above
if (tooltipTop + 120 > window.innerHeight) {
  tooltipTop = rect.top - 120 - 12;
}

// clamp left/right
if (tooltipLeft - tooltipWidth / 2 < margin) {
  tooltipLeft = tooltipWidth / 2 + margin;
}
if (tooltipLeft + tooltipWidth / 2 > window.innerWidth - margin) {
  tooltipLeft = window.innerWidth - tooltipWidth / 2 - margin;
}

const isTooltipAbove = tooltipTop < rect.top;

const fingerTop = isTooltipAbove
  ? tooltipTop + 100 // bottom of tooltip
  : tooltipTop - 26; // top of tooltip

const fingerRotation = isTooltipAbove ? '180deg' : '0deg';
const fingerEmoji = isTooltipAbove ? '👇' : '👆';
const fingerLeft = tooltipLeft;
console.log(stepIndex);
  return (
    <div className="onboarding-overlay">
      {/* spotlight */}
      <div
        className="spotlight"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />

      {/* finger */}
<div
  className="finger"
  style={{
    top: fingerTop,
    left: tooltipLeft,
    transform: `translateX(-50%) rotate(${fingerRotation})`,
  }}
>
{fingerEmoji}
</div>


      {/* tooltip */}
     <div
  className="tooltip"
  style={{
    top: tooltipTop,
    left: tooltipLeft,
    transform: 'translateX(-50%)',
  }}
>
        <p>{step.text}</p>
      <div className="tooltip-actions">
       
  {stepIndex.length < 1 ? (
    <button onClick={close}>Close</button>
  ) : (
    <>
      <button onClick={next}>Next</button>
      <button onClick={close}>Skip</button>
    </>
  )}

      </div>
    </div>
      <Glass/>
    </div>
  );
}
