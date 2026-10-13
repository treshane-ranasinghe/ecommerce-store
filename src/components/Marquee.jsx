import { useEffect, useRef } from 'react';

// Infinite marquee that skews with scroll velocity (desktop only; the loop sleeps once the skew settles).
export default function Marquee({ items, reverse, outline, speed = 40 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let lastY = window.scrollY, skew = 0, raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const v = Math.max(-18, Math.min(18, (y - lastY) * 0.6));
      lastY = y;
      skew += (v - skew) * 0.12;
      if (Math.abs(skew) < 0.01 && v === 0) skew = 0;
      if (ref.current) ref.current.style.setProperty('--skew', `${(reverse ? 1 : -1) * skew.toFixed(2)}deg`);
      raf = skew === 0 ? 0 : requestAnimationFrame(loop);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(loop); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, [reverse]);
  const row = items.map((t, i) => <span key={i} className="marquee__item">{t}<i className="marquee__star">✦</i></span>);
  return (
    <div ref={ref} className={`marquee ${reverse ? 'marquee--rev' : ''} ${outline ? 'marquee--outline' : ''}`} style={{ '--speed': `${speed}s` }} aria-hidden="true">
      <div className="marquee__track">{row}{row}</div>
    </div>
  );
}
