import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollProgress, { useIsMobile } from '../hooks/useScrollProgress';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import Marquee from '../components/Marquee';
import Counter from '../components/Counter';
import { ProductImage, PhotoOrArt } from '../components/ProductArt';
import { products, getProduct } from '../data/products';
import { formatPrice, STORE, HERO } from '../config';
import { useStore } from '../context/StoreContext';
import { PlusIcon, ChevronRight, TruckIcon, ShieldIcon, ReturnIcon, TradeIcon, BagIcon } from '../components/Icons';

/* ------------------------------------------------------------------ HERO */
const chips = [
  { t: 'A19 Pro', s: 'Fastest iPhone chip ever', pos: 'tl' },
  { t: '48MP ×3', s: 'Pro Fusion camera system', pos: 'tr' },
  { t: '6.9″', s: 'ProMotion XDR display', pos: 'bl' },
  { t: '37 hrs', s: 'Video playback', pos: 'br' },
];

function Hero() {
  const ref = useRef(null);
  const phoneRef = useRef(null);
  const product = getProduct(HERO.productId);
  const [color, setColor] = useState(product.colors[0]);
  const { addToCart } = useStore();
  useScrollProgress(ref, { mobile: 0 });

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--hx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty('--hy', ((e.clientY - r.top) / window.innerHeight - 0.5).toFixed(3));
  };

  return (
    <section ref={ref} className={`hero gate ${HERO.image && HERO.imageLayout === 'wide' ? 'hero--wide' : ''}`} style={{ '--hc': color.hex }} onPointerMove={onMove}>
      <div className="hero__sticky">
        <div className="hero__head">
          <p className="hero__eyebrow anim-in" style={{ '--d': '0ms' }}><span>{HERO.eyebrow}</span>{HERO.title}</p>
        </div>

        <h1 className="hero__mega" aria-label={HERO.title}>
          <SplitText text={HERO.bigWord} by="char" play delay={150} stagger={60} />
        </h1>

        <div className={`hero__device ${HERO.image && HERO.imageLayout === 'wide' ? 'hero__device--wide' : ''}`}>
          <div className="hero__floor" />
          <div className="hero__tilt">
            <div className="hero__float rise">
              {HERO.image ? (
                <div ref={phoneRef} className="hero__phone hero__phone--photo">
                  <PhotoOrArt src={HERO.image} alt={HERO.title} art={{ ...product.art, color: color.hex }} shadow={false} eager />
                </div>
              ) : (
                <div ref={phoneRef} key={color.name} className="hero__phone">
                  <ProductImage product={product} color={color} shadow={false} />
                </div>
              )}
            </div>
          </div>
        </div>

        {chips.map((c, i) => (
          <div key={c.t} className={`hero__chip hero__chip--${c.pos}`}>
            <div className="chip-card liquid anim-in" style={{ '--d': `${900 + i * 120}ms` }}>
              <strong>{c.t}</strong><span>{c.s}</span>
            </div>
          </div>
        ))}

        <div className="hero__dockwrap">
        <div className="hero__dock liquid anim-in" style={{ '--d': '1100ms' }}>
          <div className="dock__price">
            <small>From</small>
            <strong>{formatPrice(product.price)}</strong>
          </div>
          <div className="dock__colors" role="radiogroup" aria-label="Choose a color">
            {product.colors.map((c) => (
              <button key={c.name} role="radio" aria-checked={c.name === color.name} aria-label={c.name} title={c.name}
                className={`swatch ${c.name === color.name ? 'is-on' : ''}`} style={{ '--c': c.hex }} onClick={() => setColor(c)} />
            ))}
            <span className="dock__cname">{color.name}</span>
          </div>
          <div className="dock__ctas">
            <button className="icon-btn dock__add" onClick={() => addToCart(product, { color: color.name, sourceEl: phoneRef.current })} aria-label="Add to bag"><BagIcon /></button>
            <Link to={`/product/${product.id}`} className="btn btn--primary" data-magnetic>Buy now</Link>
          </div>
        </div>
        </div>

        <div className="hero__scroll" aria-hidden="true"><span>Scroll</span><i /></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- WORD REVEAL */
function Statement() {
  const ref = useRef(null);
  useScrollProgress(ref, { mobile: 1 });
  const parts = [
    ['The most powerful', 0], ['iPhones.', 1], ['The most immersive', 0], ['AirPods.', 1],
    ['And every accessory that keeps you', 0], ['charged,', 1], ['protected and connected —', 0], ['delivered to your door.', 0],
  ];
  const words = parts.flatMap(([t, hl]) => t.split(' ').map((w) => [w, hl]));
  return (
    <section ref={ref} className="statement">
      <div className="statement__sticky container">
        <p className="eyebrow">Why {STORE.name}</p>
        <p className="statement__text">
          {words.map(([w, hl], i) => (
            <span key={i} className={hl ? 'hl' : ''} style={{ '--i': i / words.length }}>{w} </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------- PINNED LINEUP */
function LineupCard({ product, index }) {
  const [color, setColor] = useState(product.colors[0]);
  const imgRef = useRef(null);
  const { addToCart } = useStore();
  return (
    <article className="lcard liquid spot" style={{ '--tint': color.hex }}>
      <div className="lcard__copy">
        <span className="lcard__idx">0{index + 1}</span>
        {product.badge && <span className="lcard__badge">{product.badge}</span>}
        <h3>{product.name}</h3>
        <p className="lcard__tag">{product.tagline}</p>
        <ul className="lcard__hl">{product.highlights.slice(0, 3).map((h) => <li key={h}>{h}</li>)}</ul>
        <div className="lcard__colors">
          {product.colors.map((c) => (
            <button key={c.name} className={`swatch ${c.name === color.name ? 'is-on' : ''}`} style={{ '--c': c.hex }} aria-label={c.name} title={c.name} onClick={() => setColor(c)} />
          ))}
        </div>
        <div className="lcard__foot">
          <span className="lcard__price"><small>From</small>{formatPrice(product.price)}</span>
          <div className="lcard__ctas">
            <button className="icon-btn liquid" onClick={() => addToCart(product, { color: color.name, sourceEl: imgRef.current })} aria-label={`Add ${product.name} to bag`}><PlusIcon /></button>
            <Link to={`/product/${product.id}`} className="btn btn--primary btn--sm">Buy</Link>
          </div>
        </div>
      </div>
      <div className="lcard__visual">
        <span className="lcard__glow" />
        {product.showcase?.color === color.name ? (
          <div ref={imgRef} key={color.name} className="lcard__img lcard__img--wide">
            <PhotoOrArt src={product.showcase.image} alt={product.name} art={{ ...product.art, color: color.hex }} shadow={false} />
          </div>
        ) : (
          <div ref={imgRef} key={color.name} className="lcard__img"><ProductImage product={product} color={color} shadow={false} /></div>
        )}
      </div>
    </article>
  );
}

function Lineup() {
  const ref = useRef(null);
  const track = useRef(null);
  const phones = products.filter((p) => p.category === 'iphone');
  const isMobile = useIsMobile();
  // Phones get a native swipe carousel instead of the scroll-pinned track.
  useEffect(() => {
    if (isMobile) {
      ref.current.style.removeProperty('--dist');
      ref.current.style.height = '';
      return;
    }
    const set = () => {
      const dist = Math.max(0, track.current.scrollWidth - window.innerWidth);
      ref.current.style.setProperty('--dist', `${dist}px`);
      ref.current.style.height = `${dist + window.innerHeight}px`;
    };
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, [isMobile]);
  useScrollProgress(ref, { mobile: 0 });
  return (
    <section ref={ref} className="lineup">
      <div className="lineup__sticky">
        <div className="lineup__head container">
          <h2><SplitText text="Which iPhone is" /> <span className="grad-text"><SplitText text="right for you?" delay={200} /></span></h2>
          <div className="lineup__progress"><span /></div>
        </div>
        <div ref={track} className="lineup__track">
          {phones.map((p, i) => <LineupCard key={p.id} product={p} index={i} />)}
          <Link to="/shop/iphone" className="lcard lcard--more liquid spot">
            <span>Compare all models</span><ChevronRight width={28} height={28} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- BENTO */
const bento = [
  { id: 'airpods-pro-3', area: 'a', fx: 'waves', kicker: 'Hear the difference.' },
  { id: 'airpods-max', area: 'b', color: 'Purple', kicker: 'High-fidelity, over-ear.' },
  { id: 'magsafe-battery', area: 'c', kicker: 'Snap on. Power up.' },
  { id: 'airtag-4-pack', area: 'd', fx: 'ping', kicker: 'Never lose a thing.' },
  { id: 'magsafe-charger', area: 'e', kicker: '25W of magnetic charging.' },
  { id: 'silicone-case-17-pro', area: 'f', color: 'Terra Cotta', kicker: 'Soft-touch protection.' },
];

function BentoCard({ item, delay }) {
  const p = getProduct(item.id);
  const color = p.colors.find((c) => c.name === item.color) || p.colors[0];
  const imgRef = useRef(null);
  const { addToCart } = useStore();
  return (
    <Reveal variant="scale" delay={delay} className={`bento__cell bento__cell--${item.area}`}>
      <div className="bcard liquid spot" data-tilt="5" style={{ '--tint': color.hex }}>
        {item.fx && <div className={`fx fx--${item.fx}`} aria-hidden="true"><span /><span /><span /></div>}
        <div className="bcard__copy">
          <p className="bcard__kicker">{item.kicker}</p>
          <Link to={`/product/${p.id}`} className="bcard__name">{p.name}</Link>
        </div>
        <Link to={`/product/${p.id}`} className="bcard__img" ref={imgRef}><ProductImage product={p} color={color} shadow={false} /></Link>
        <div className="bcard__foot">
          <span>{formatPrice(p.price)}</span>
          <button className="add-pill" onClick={() => addToCart(p, { color: color.name, sourceEl: imgRef.current })} aria-label={`Add ${p.name} to bag`}><PlusIcon width={18} height={18} /><span>Add</span></button>
        </div>
      </div>
    </Reveal>
  );
}

function Bento() {
  return (
    <section className="section container">
      <h2 className="section__title"><SplitText text="Sound. Power." /><br /><span className="muted"><SplitText text="Everything else you love." delay={150} /></span></h2>
      <div className="bento">
        {bento.map((b, i) => <BentoCard key={b.id} item={b} delay={i * 80} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- BATTERY */
function Battery() {
  const ref = useRef(null);
  const num = useRef(null);
  const banks = products.filter((p) => p.category === 'powerbanks');
  useScrollProgress(ref, {
    mobile: 'through',
    onUpdate: (p) => { if (num.current) num.current.textContent = Math.round(Math.min(1, p * 1.3) * 100); },
  });
  return (
    <section ref={ref} className="battery">
      <div className="battery__sticky container">
        <div className="battery__copy">
          <p className="eyebrow">Power banks</p>
          <h2><SplitText text="Never hit" /> <span className="battery__zero"><SplitText text="0%" delay={150} /></span> <SplitText text="again." delay={250} /></h2>
          <p className="muted">From pocket-size MagSafe packs to a 65W powerhouse that charges your laptop.</p>
          <ul className="battery__list">
            {banks.map((b) => (
              <li key={b.id}>
                <Link to={`/product/${b.id}`} className="mini liquid spot">
                  <span className="mini__img"><ProductImage product={b} shadow={false} /></span>
                  <span className="mini__txt"><strong>{b.name}</strong><small>{b.highlights[0]}</small></span>
                  <span className="mini__price">{formatPrice(b.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="battery__visual" aria-hidden="true">
          <div className="battery__cap" />
          <div className="battery__body">
            <div className="battery__fill">
              <svg className="battery__wave" viewBox="0 0 600 40" preserveAspectRatio="none"><path d="M0 20 Q 75 0 150 20 T 300 20 T 450 20 T 600 20 V40 H0z" /></svg>
              <span className="battery__bubbles"><i /><i /><i /><i /><i /></span>
            </div>
            <div className="battery__pct"><b ref={num}>0</b><span>%</span></div>
            <svg className="battery__bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- PROMISE */
function Pledge() {
  const items = [
    [TruckIcon, 'Free delivery', <><Counter prefix="$" to={STORE.freeShippingThreshold} />+</>, 'orders ship free'],
    [ShieldIcon, 'Warranty', <><Counter to={1} /> yr</>, 'manufacturer warranty'],
    [ReturnIcon, 'Returns', <><Counter to={14} /> days</>, 'free, no-questions returns'],
    [TradeIcon, 'Dispatch', <>&lt;<Counter to={24} />h</>, 'same-day dispatch'],
  ];
  return (
    <section className="section promise">
      <div className="container">
        <h2 className="section__title"><SplitText text={`The ${STORE.name} promise.`} /></h2>
        <div className="promise__grid">
          {items.map(([Icon, label, big, sub], i) => (
            <Reveal key={label} delay={i * 90} variant="up" className="promise__cell">
              <div className="pcell liquid spot">
                <span className="pcell__icon"><Icon width={22} height={22} /></span>
                <p className="pcell__label">{label}</p>
                <p className="pcell__big">{big}</p>
                <p className="pcell__sub">{sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CTA */
function Cta() {
  const { notify } = useStore();
  return (
    <section className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title"><SplitText text="Stay" by="char" /> <span className="grad-text"><SplitText text="charged." by="char" delay={200} /></span></h2>
        <Reveal variant="blur" delay={300}><p className="muted">Launch alerts, exclusive drops and early access — straight to your inbox.</p></Reveal>
        <Reveal variant="up" delay={450}>
          <form className="cta__form liquid" onSubmit={(e) => { e.preventDefault(); e.target.reset(); notify('You’re on the list ✓'); }}>
            <input type="email" required placeholder="you@email.com" aria-label="Email address" />
            <button className="btn btn--primary" data-magnetic>Subscribe</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const names = ['iPhone 17 Pro Max', 'AirPods Pro 3', 'iPhone Air', 'MagSafe', 'AirPods Max', 'PowerCore 20K', 'iPhone 17', 'AirTag'];
  return (
    <>
      <Hero />
      <div className="marquees">
        <Marquee items={names} speed={38} />
        <Marquee items={['Free delivery', 'Genuine products', '14-day returns', 'Trade-in credit', 'Same-day dispatch']} reverse outline speed={46} />
      </div>
      <Statement />
      <Lineup />
      <Bento />
      <Battery />
      <Pledge />
      <Cta />
    </>
  );
}
