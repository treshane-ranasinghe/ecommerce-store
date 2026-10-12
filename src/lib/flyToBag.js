// Clones a product image and flies it in an arc into the bag icon.
export function flyToBag(source) {
  const target = document.querySelector('[data-bag-target]');
  if (!source || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if (!s.width) return;
  const clone = source.cloneNode(true);
  clone.removeAttribute('data-tilt');
  Object.assign(clone.style, {
    position: 'fixed', left: `${s.left}px`, top: `${s.top}px`, width: `${s.width}px`, height: `${s.height}px`,
    margin: 0, zIndex: 999, pointerEvents: 'none', animation: 'none', transform: 'none',
  });
  clone.classList.add('fly-clone');
  document.body.appendChild(clone);
  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  const anim = clone.animate([
    { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 140}px) scale(0.6) rotate(-10deg)`, opacity: 1, offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.05) rotate(-28deg)`, opacity: 0.2 },
  ], { duration: 950, easing: 'cubic-bezier(.55,0,.2,1)' });
  anim.onfinish = () => {
    clone.remove();
    target.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.45) rotate(-8deg)' }, { transform: 'scale(1)' }],
      { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' },
    );
  };
}
