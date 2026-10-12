import { useEffect, useRef, useState } from 'react';

// Masked word/char reveal. `play` forces it on; otherwise it plays when scrolled into view.
export default function SplitText({ text, as: Tag = 'span', by = 'word', className = '', delay = 0, stagger, play }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const step = stagger ?? (by === 'char' ? 45 : 70);
  useEffect(() => {
    if (play !== undefined) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [play]);
  const on = play ?? inView;
  let i = 0;
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`split ${on ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true">
          {by === 'char' ? (
            <span className="split__word">
              {[...w].map((ch, ci) => <span key={ci} className="split__w"><span className="split__i" style={{ '--d': delay + step * i++ }}>{ch}</span></span>)}
            </span>
          ) : (
            <span className="split__w"><span className="split__i" style={{ '--d': delay + step * i++ }}>{w}</span></span>
          )}
          {wi < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
