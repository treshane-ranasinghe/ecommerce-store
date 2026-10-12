import { useEffect, useRef } from 'react';

// Writes scroll progress (0 → 1) of `ref` into the CSS var --p without React re-renders.
// mode 'sticky': progress while a tall section scrolls past a pinned child.
// mode 'through': progress from entering to leaving the viewport.
export default function useScrollProgress(ref, { mode = 'sticky', onUpdate } = {}) {
  const cb = useRef(onUpdate);
  cb.current = onUpdate;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = mode === 'sticky' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
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
  }, [ref, mode]);
}
