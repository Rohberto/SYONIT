import { useEffect, useState } from 'react';

export default function SimpleTooltip({ targetId, text }) {
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const el = document.getElementById(targetId);
    if (!el) {
      console.warn('Tooltip target not found:', targetId);
      return;
    }

    const r = el.getBoundingClientRect();

    setStyle({
      position: 'absolute',
      top: r.bottom + window.scrollY + 8,
      left: r.left + r.width / 2,
      transform: 'translateX(-50%)',
      zIndex: 9999,
    });
  }, [targetId]);

  if (!style) return null;

  return (
    <div style={style}>
      <div className="simple-tooltip">
        <div
  style={{
    position: 'absolute',
    top: style.top - 30,
    left: style.left,
    transform: 'translateX(-50%)',
    fontSize: 24,
    animation: 'bounce 1s infinite',
  }}
>
  👆
</div>

        {text}
      </div>
    </div>
  );
}
