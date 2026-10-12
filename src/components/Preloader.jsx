import { useEffect, useState } from 'react';
import { STORE } from '../config';

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    let raf, t0, timer;
    const dur = 1500;
    const step = (t) => {
      t0 ??= t;
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else { setOut(true); timer = setTimeout(onDone, 900); }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [onDone]);
  return (
    <div className={`preloader ${out ? 'is-out' : ''}`} aria-hidden="true">
      <div className="preloader__panel preloader__panel--top" />
      <div className="preloader__panel preloader__panel--bottom" />
      <div className="preloader__center">
        <div className="preloader__logo"><span className="nav__logo-dot" />{STORE.name}</div>
        <div className="preloader__bar"><span style={{ transform: `scaleX(${n / 100})` }} /></div>
      </div>
      <div className="preloader__num">{n}</div>
    </div>
  );
}
