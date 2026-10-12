import { useId, useState } from 'react';

// Lighten (amt > 0) or darken (amt < 0) a hex color.
const shade = (hex, amt) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt / 100) * 255)));
  const r = f(n >> 16), g = f((n >> 8) & 0xff), b = f(n & 0xff);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const Lens = ({ cx, cy, r, rim }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 3} fill={rim} />
    <circle cx={cx} cy={cy} r={r} fill="#141417" />
    <circle cx={cx} cy={cy} r={r * 0.55} fill="#1d2a4a" />
    <circle cx={cx} cy={cy} r={r * 0.25} fill="#0b0f1c" />
    <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.15} fill="#fff" opacity=".5" />
  </g>
);

function Iphone({ c, v, uid }) {
  const rim = shade(c, -22);
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(c, 10)} />
          <stop offset=".55" stopColor={c} />
          <stop offset="1" stopColor={shade(c, -14)} />
        </linearGradient>
      </defs>
      <rect x="92" y="70" width="3" height="18" rx="1.5" fill={rim} />
      <rect x="92" y="98" width="3" height="30" rx="1.5" fill={rim} />
      <rect x="205" y="90" width="3" height="40" rx="1.5" fill={rim} />
      <rect x="95" y="18" width="110" height="264" rx="24" fill={`url(#${uid}b)`} />
      <rect x="96.5" y="19.5" width="107" height="261" rx="22.5" fill="none" stroke={shade(c, 18)} strokeOpacity=".7" strokeWidth="1.5" />
      <rect x="95" y="18" width="110" height="264" rx="24" fill="none" stroke={rim} strokeWidth="2" />
      {v === 'pro' && (
        <>
          <path d="M95 42a24 24 0 0 1 24-24h62a24 24 0 0 1 24 24v44H95z" fill={shade(c, -6)} />
          <rect x="103" y="26" width="72" height="72" rx="20" fill={shade(c, -10)} />
          <Lens cx={124} cy={46} r={11} rim={rim} />
          <Lens cx={124} cy={78} r={11} rim={rim} />
          <Lens cx={153} cy={62} r={11} rim={rim} />
          <circle cx="188" cy="44" r="4" fill="#f5f0e1" />
          <circle cx="188" cy="78" r="3.5" fill="#1a1a1a" />
        </>
      )}
      {v === 'air' && (
        <>
          <rect x="99" y="28" width="102" height="36" rx="18" fill={shade(c, -10)} />
          <Lens cx={120} cy={46} r={10} rim={rim} />
          <circle cx="150" cy="46" r="4" fill="#141417" />
          <circle cx="178" cy="46" r="3.5" fill="#f5f0e1" />
        </>
      )}
      {v === 'std' && (
        <>
          <rect x="106" y="28" width="38" height="72" rx="19" fill={shade(c, -8)} />
          <Lens cx={125} cy={47} r={10} rim={rim} />
          <Lens cx={125} cy={81} r={10} rim={rim} />
          <circle cx="156" cy="40" r="3.5" fill="#f5f0e1" />
        </>
      )}
      {v === 'e' && (
        <>
          <rect x="106" y="28" width="36" height="36" rx="12" fill={shade(c, -8)} />
          <Lens cx={124} cy={46} r={10} rim={rim} />
          <circle cx="152" cy="36" r="3" fill="#f5f0e1" />
        </>
      )}
      <circle cx="150" cy="160" r="14" fill={shade(c, -6)} opacity=".35" />
    </g>
  );
}

function Bud({ x, flip }) {
  return (
    <g transform={`translate(${x} 40) ${flip ? 'scale(-1 1)' : ''} rotate(-14)`}>
      <rect x="-6" y="10" width="13" height="52" rx="6.5" fill="url(#budG)" />
      <ellipse cx="0" cy="10" rx="17" ry="15" fill="url(#budG)" />
      <ellipse cx="6" cy="8" rx="6" ry="7" fill="#d5d5da" />
    </g>
  );
}

function AirPods({ c, v, uid }) {
  if (v === 'max') {
    return (
      <g>
        <defs>
          <linearGradient id={`${uid}m`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={shade(c, 12)} />
            <stop offset="1" stopColor={shade(c, -14)} />
          </linearGradient>
        </defs>
        <path d="M78 165 C78 40 222 40 222 165" fill="none" stroke={shade(c, -20)} strokeWidth="16" strokeLinecap="round" />
        <path d="M84 160 C86 54 214 54 216 160" fill="none" stroke={shade(c, 22)} strokeWidth="8" strokeLinecap="round" strokeDasharray="2 3" />
        <rect x="70" y="148" width="14" height="30" rx="5" fill="#cfd0d4" />
        <rect x="216" y="148" width="14" height="30" rx="5" fill="#cfd0d4" />
        <rect x="52" y="168" width="62" height="100" rx="28" fill={`url(#${uid}m)`} />
        <rect x="104" y="178" width="18" height="80" rx="9" fill={shade(c, -24)} />
        <rect x="186" y="168" width="62" height="100" rx="28" fill={`url(#${uid}m)`} />
        <rect x="178" y="178" width="18" height="80" rx="9" fill={shade(c, -24)} />
        <rect x="64" y="176" width="10" height="24" rx="5" fill={shade(c, -10)} />
      </g>
    );
  }
  const pro = v === 'pro';
  const box = pro ? { x: 72, y: 128, w: 156, h: 120, rx: 36 } : { x: 88, y: 122, w: 124, h: 128, rx: 44 };
  const lid = box.y + box.h * 0.36;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dedee3" />
        </linearGradient>
        <linearGradient id="budG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e1e1e6" />
        </linearGradient>
      </defs>
      <Bud x={118} />
      <Bud x={182} flip />
      <rect {...{ x: box.x, y: box.y, width: box.w, height: box.h, rx: box.rx }} fill={`url(#${uid}c)`} stroke="#d2d2d7" />
      <line x1={box.x + 2} x2={box.x + box.w - 2} y1={lid} y2={lid} stroke="#cfcfd4" strokeWidth="1.5" />
      <circle cx="150" cy={lid + 16} r="3" fill="#7bd88f" />
      {pro && <rect x="143" y={box.y + box.h - 5} width="14" height="4" rx="2" fill="#bdbdc2" />}
    </g>
  );
}

function PowerBank({ c, v, uid }) {
  const g = (
    <defs>
      <linearGradient id={`${uid}p`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={shade(c, 10)} />
        <stop offset="1" stopColor={shade(c, -14)} />
      </linearGradient>
    </defs>
  );
  if (v === 'magsafe') {
    return (
      <g>
        {g}
        <rect x="92" y="62" width="116" height="168" rx="24" fill={`url(#${uid}p)`} stroke={shade(c, -18)} />
        <circle cx="150" cy="146" r="40" fill="none" stroke={shade(c, -10)} strokeWidth="3" />
        <circle cx="150" cy="146" r="12" fill="none" stroke={shade(c, -10)} strokeWidth="2" />
        <rect x="140" y="226" width="20" height="5" rx="2.5" fill="#333" />
      </g>
    );
  }
  const big = v === 'big';
  const b = big ? { x: 72, y: 40, w: 156, h: 230 } : { x: 84, y: 56, w: 132, h: 200 };
  return (
    <g>
      {g}
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="26" fill={`url(#${uid}p)`} stroke={shade(c, -20)} />
      <rect x={b.x + 6} y={b.y + 6} width={b.w - 12} height={b.h - 12} rx="21" fill="none" stroke={shade(c, 14)} strokeOpacity=".5" />
      {big ? (
        <>
          <rect x="112" y="70" width="76" height="40" rx="10" fill="#0e0f12" />
          <text x="150" y="97" textAnchor="middle" fontSize="18" fontWeight="700" fill="#5ee38a" fontFamily="Inter, sans-serif">87%</text>
        </>
      ) : (
        [0, 1, 2, 3].map((i) => <circle key={i} cx={132 + i * 12} cy={b.y + b.h - 34} r="3.2" fill={i < 3 ? '#5ee38a' : shade(c, -25)} />)
      )}
      <rect x="132" y={b.y - 3} width="36" height="6" rx="3" fill="#1d1d1f" />
    </g>
  );
}

function Charger({ uid }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d9de" />
        </linearGradient>
      </defs>
      <rect x="128" y="50" width="9" height="40" rx="3" fill="#c7c8cc" />
      <rect x="163" y="50" width="9" height="40" rx="3" fill="#c7c8cc" />
      <rect x="95" y="86" width="110" height="130" rx="20" fill={`url(#${uid}w)`} stroke="#d0d0d5" />
      <rect x="133" y="186" width="34" height="11" rx="5.5" fill="#2a2a2c" />
      <path d="M150 216 C150 250 110 250 96 288" fill="none" stroke="#e9e9ee" strokeWidth="9" strokeLinecap="round" />
    </g>
  );
}

function MagSafe({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}r`} cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6d6db" />
        </radialGradient>
      </defs>
      <path d="M150 196 C150 250 230 240 236 290" fill="none" stroke="#d3d3d8" strokeWidth="11" strokeLinecap="round" />
      <path d="M150 196 C150 250 230 240 236 290" fill="none" stroke="#f6f6f8" strokeWidth="8" strokeLinecap="round" />
      <circle cx="150" cy="126" r="76" fill="#c9c9ce" />
      <circle cx="150" cy="124" r="74" fill={`url(#${uid}r)`} />
      <circle cx="150" cy="124" r="50" fill="none" stroke="#e1e1e6" strokeWidth="2" />
      <circle cx="150" cy="124" r="14" fill="none" stroke="#e1e1e6" strokeWidth="2" />
    </g>
  );
}

function Cable() {
  const d = 'M80 250 C 60 150, 240 150, 220 210 S 100 260, 110 170 S 230 80, 220 60';
  return (
    <g>
      <path d={d} fill="none" stroke="#d3d3d8" strokeWidth="11" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#f7f7f9" strokeWidth="8" strokeLinecap="round" strokeDasharray="3 2" />
      <rect x="70" y="244" width="20" height="34" rx="6" fill="#ececf0" stroke="#cfcfd4" />
      <rect x="75" y="276" width="10" height="12" rx="3" fill="#a6a6ab" />
      <rect x="210" y="30" width="20" height="34" rx="6" fill="#ececf0" stroke="#cfcfd4" />
      <rect x="215" y="20" width="10" height="12" rx="3" fill="#a6a6ab" />
    </g>
  );
}

function Case({ c, v, uid }) {
  const clear = v === 'clear';
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}k`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(c, 8)} />
          <stop offset="1" stopColor={shade(c, -12)} />
        </linearGradient>
      </defs>
      {clear && <rect x="99" y="22" width="102" height="256" rx="22" fill="#dfe6ee" />}
      <rect x="92" y="15" width="116" height="270" rx="28" fill={clear ? 'rgba(255,255,255,.35)' : `url(#${uid}k)`} stroke={clear ? '#c3ccd6' : shade(c, -20)} strokeWidth="2" />
      <rect x="102" y="24" width="78" height="78" rx="22" fill={clear ? 'rgba(20,20,22,.12)' : shade(c, -26)} />
      <circle cx="150" cy="168" r="40" fill="none" stroke={clear ? '#b9c3cf' : shade(c, -8)} strokeWidth="3" />
      <rect x="205" y="140" width="5" height="26" rx="2" fill={clear ? '#c3ccd6' : shade(c, -24)} />
    </g>
  );
}

function AirTag({ c, uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}t`} cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9d9de" />
        </radialGradient>
      </defs>
      <circle cx="122" cy="180" r="62" fill="#c8c8cd" opacity=".55" />
      <circle cx="122" cy="178" r="60" fill={`url(#${uid}t)`} />
      <circle cx="186" cy="126" r="66" fill="#c8c8cd" />
      <circle cx="186" cy="124" r="64" fill={`url(#${uid}t)`} />
      <circle cx="186" cy="124" r="48" fill="none" stroke="#e5e5ea" strokeWidth="2" />
    </g>
  );
}

const renderers = { iphone: Iphone, airpods: AirPods, powerbank: PowerBank, charger: Charger, magsafe: MagSafe, cable: Cable, case: Case, airtag: AirTag };

export default function ProductArt({ type, variant, color = '#d2d2d7', className = '', shadow = true }) {
  const uid = useId().replace(/:/g, '');
  const R = renderers[type] || Iphone;
  return (
    <svg className={`product-art ${className}`} viewBox="0 0 300 300" role="img" aria-hidden="true">
      <defs>
        <filter id={`${uid}s`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {shadow && <ellipse cx="150" cy="292" rx="70" ry="6" fill="#000" opacity=".18" filter={`url(#${uid}s)`} />}
      <R c={color} v={variant} uid={uid} />
    </svg>
  );
}

// Shows a real photo when one is set (per color via `color.image`, or `product.image`).
// If the file is missing or fails to load, falls back to the SVG illustration.
export function ProductImage({ product, color, className = '', shadow }) {
  const hex = color?.hex || product.colors?.[0]?.hex;
  const src = color?.image || product.image;
  return <PhotoOrArt src={src} alt={product.name} art={{ ...product.art, color: hex }} className={className} shadow={shadow} />;
}

export function PhotoOrArt({ src, alt = '', art, className = '', shadow, eager }) {
  const [failed, setFailed] = useState(null);
  if (src && failed !== src) {
    return <img className={`product-art product-photo ${className}`} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(src)} />;
  }
  return <ProductArt {...art} className={className} shadow={shadow} />;
}
