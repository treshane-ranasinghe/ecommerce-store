import { useEffect, useRef, useState } from 'react';

export const MOBILE_QUERY = '(max-width: 760px)';

export function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const on = () => setMobile(mql.matches);
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, []);
  return mobile;
}

// Writes scroll progress (0 → 1) of `ref` into the CSS var --p without React re-renders.
// mode 'sticky': progress while a tall section scrolls past a pinned child.
// mode 'through': progress from entering to leaving the viewport.
// mobile: on small screens, either a different mode or a fixed number (pinning is turned off there).
export default function useScrollProgress(ref, { mode = 'sticky', onUpdate, mobile } = {}) {
  const cb = useRef(onUpdate);
  cb.current = onUpdate;
  const isMobile = useIsMobile();
  const active = isMobile && mobile !== undefined ? mobile : mode;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof active === 'number') {
      el.style.setProperty('--p', active);
      cb.current?.(active);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = active === 'sticky' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      const p = Math.min(1, Math.max(0, raw));
      el.style.setProperty('--p', p.toFixed(4));
      cb.current?.(p);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, active]);
}
