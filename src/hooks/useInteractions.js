import { useEffect } from 'react';

// One global pointer listener drives: cursor aura, card spotlights (.spot),
// 3D tilt ([data-tilt="deg"]) and magnetic buttons ([data-magnetic]).
export default function useInteractions() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const aura = document.querySelector('.aura');
    let tiltEl = null, magEl = null, raf = 0, last = null;

    const resetTilt = (el) => { el?.style.setProperty('--rx', '0deg'); el?.style.setProperty('--ry', '0deg'); };
    const resetMag = (el) => { if (el) el.style.translate = ''; };

    const frame = () => {
      raf = 0;
      const e = last;
      if (aura) aura.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const t = e.target instanceof Element ? e.target : null;

      const spot = t?.closest('.spot');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      const tilt = t?.closest('[data-tilt]');
      if (tilt !== tiltEl) { resetTilt(tiltEl); tiltEl = tilt; }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const m = Number(tilt.dataset.tilt) || 8;
        tilt.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * m).toFixed(2)}deg`);
        tilt.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * m).toFixed(2)}deg`);
      }
      const mag = t?.closest('[data-magnetic]');
      if (mag !== magEl) { resetMag(magEl); magEl = mag; }
      if (mag) {
        const r = mag.getBoundingClientRect();
        mag.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1)}px`;
      }
    };
    const onMove = (e) => { last = e; if (!raf) raf = requestAnimationFrame(frame); };
    const onLeave = () => { resetTilt(tiltEl); resetMag(magEl); tiltEl = magEl = null; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);
}
