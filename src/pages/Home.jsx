import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useScrollProgress from '../hooks/useScrollProgress';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import ProductCard from '../components/ProductCard';
import { ProductImage, PhotoOrArt } from '../components/ProductArt';
import { products, categories, getProduct } from '../data/products';
import { formatPrice, STORE, HERO } from '../config';
import { useStore } from '../context/StoreContext';
import { PlusIcon, ChevronLeft, ChevronRight, TruckIcon, ShieldIcon, ReturnIcon, StoreIcon, BagIcon } from '../components/Icons';

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

/* ------------------------------------------------------------ SHARED */
function SectionHead({ title, sub, to, cta }) {
  return (
    <Reveal className="shead">
      <h2 className="shead__title">{title} <span>{sub}</span></h2>
      {to && <Link to={to} className="shead__link">{cta}<ChevronRight width={16} height={16} /></Link>}
    </Reveal>
  );
}

function ColorDots({ product, color, onChange }) {
  if (product.colors.length < 2) return null;
  return (
    <div className="dots" role="radiogroup" aria-label={`${product.name} color`}>
      {product.colors.map((c) => (
        <button key={c.name} type="button" role="radio" aria-checked={c.name === color.name} aria-label={c.name} title={c.name}
          className={`swatch ${c.name === color.name ? 'is-on' : ''}`} style={{ '--c': c.hex }} onClick={() => onChange(c)} />
      ))}
    </div>
  );
}

// Native horizontal scroller with prev/next buttons for pointer users.
function Rail({ label, children }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = () => {
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(measure); };
  useEffect(() => {
    measure();
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf.current); };
  }, []);
  const go = (dir) => {
    const el = ref.current;
    const card = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth;
    el.scrollBy({ left: dir * Math.max(card + 20, el.clientWidth - card), behavior: 'smooth' });
  };
  return (
    <div className="rail">
      <div ref={ref} className="rail__track" role="list" aria-label={label} onScroll={onScroll}>{children}</div>
      <div className="rail__nav container">
        <button type="button" className="rail__btn" onClick={() => go(-1)} disabled={edge.start} aria-label="Scroll back"><ChevronLeft /></button>
        <button type="button" className="rail__btn" onClick={() => go(1)} disabled={edge.end} aria-label="Scroll forward"><ChevronRight /></button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- CATEGORIES */
const categoryArt = {
  iphone: ['iphone-17-pro-max', 'Cosmic Orange'],
  airpods: ['airpods-pro-3'],
  powerbanks: ['powercore-10k'],
  accessories: ['silicone-case-17-pro', 'Orange'],
};

function Categories() {
  return (
    <section className="hsec hsec--first">
      <div className="container">
        <SectionHead title="Shop by category." sub="Find exactly what you need." to="/shop" cta="Browse all" />
        <div className="cats">
          {categories.map((c, i) => {
            const [id, colorName] = categoryArt[c.id];
            const p = getProduct(id);
            const color = p.colors.find((x) => x.name === colorName) || p.colors[0];
            const count = products.filter((x) => x.category === c.id).length;
            return (
              <Reveal key={c.id} delay={i * 70} className="cats__cell">
                <Link to={`/shop/${c.id}`} className="cat">
                  <span className="cat__txt"><strong>{c.name}</strong><small>{count} products</small></span>
                  <span className="cat__img"><ProductImage product={p} color={color} shadow={false} /></span>
                  <span className="cat__go" aria-hidden="true"><ChevronRight width={16} height={16} /></span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ LATEST */
const latestIds = ['iphone-17-pro-max', 'iphone-air', 'airpods-pro-3', 'airpods-max', 'iphone-17', 'powercore-20k', 'magsafe-battery', 'silicone-case-17-pro', 'airtag-4-pack'];

function LatestCard({ product }) {
  const [color, setColor] = useState(product.colors[0]);
  const imgRef = useRef(null);
  const { addToCart } = useStore();
  const cat = categories.find((c) => c.id === product.category);
  return (
    <article className="tile" role="listitem">
      <div>
        <p className={`tile__eyebrow ${product.badge ? '' : 'tile__eyebrow--muted'}`}>{product.badge || cat?.name}</p>
        <Link to={`/product/${product.id}`} className="tile__name">{product.name}</Link>
        <p className="tile__tag">{product.tagline}</p>
      </div>
      <Link to={`/product/${product.id}`} className="tile__img" ref={imgRef} tabIndex={-1} aria-hidden="true">
        <ProductImage key={color.name} product={product} color={color} shadow={false} />
      </Link>
      <div className="tile__dots"><ColorDots product={product} color={color} onChange={setColor} /></div>
      <div className="tile__foot">
        <span className="tile__price">{product.storage?.length > 1 && <small>From</small>}{formatPrice(product.price)}</span>
        <div className="tile__ctas">
          <button type="button" className="add-pill" onClick={() => addToCart(product, { color: color.name, sourceEl: imgRef.current })} aria-label={`Add ${product.name} to bag`}>
            <PlusIcon width={18} height={18} /><span>Add</span>
          </button>
          <Link to={`/product/${product.id}`} className="btn btn--dark btn--sm">Buy</Link>
        </div>
      </div>
    </article>
  );
}

function Latest() {
  return (
    <section className="hsec">
      <div className="container"><SectionHead title="The latest." sub="Take a look at what’s new." to="/shop" cta="Shop all" /></div>
      <Rail label="Latest products">{latestIds.map((id) => <LatestCard key={id} product={getProduct(id)} />)}</Rail>
    </section>
  );
}

/* ----------------------------------------------------------- COMPARE */
const compareRows = ['Display', 'Chip', 'Camera', 'Battery'];

function Compare() {
  const phones = products.filter((p) => p.category === 'iphone');
  const [sel, setSel] = useState(() => Object.fromEntries(phones.map((p) => [p.id, p.colors[0]])));
  const imgs = useRef({});
  const { addToCart } = useStore();
  return (
    <section className="hsec">
      <div className="container">
        <SectionHead title="Which iPhone is right for you?" sub="Compare every model." to="/shop/iphone" cta="Shop iPhone" />
        <Reveal className="cmp-wrap" variant="fade">
          <div className="cmp" style={{ '--n': phones.length }}>
            {phones.map((p) => (
              <div key={p.id} className="cmp__head">
                <Link to={`/product/${p.id}`} className="cmp__img" ref={(el) => { imgs.current[p.id] = el; }} tabIndex={-1} aria-hidden="true">
                  <ProductImage key={sel[p.id].name} product={p} color={sel[p.id]} shadow={false} />
                </Link>
                <div className="cmp__dots"><ColorDots product={p} color={sel[p.id]} onChange={(c) => setSel((s) => ({ ...s, [p.id]: c }))} /></div>
                <span className="cmp__badge">{p.badge}</span>
                <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
                <p className="cmp__tag">{p.tagline}</p>
                <p className="cmp__price">From {formatPrice(p.price)}</p>
                <div className="cmp__ctas">
                  <Link to={`/product/${p.id}`} className="btn btn--primary btn--sm">Buy</Link>
                  <button type="button" className="link-btn" onClick={() => addToCart(p, { color: sel[p.id].name, sourceEl: imgs.current[p.id] })}>Add to bag</button>
                </div>
              </div>
            ))}
            {compareRows.map((row) => (
              <Fragment key={row}>
                <p className="cmp__label"><span>{row}</span></p>
                {phones.map((p) => <p key={p.id} className="cmp__val">{p.specs[row] || '—'}</p>)}
              </Fragment>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- AUDIO */
function RowCard({ product }) {
  const imgRef = useRef(null);
  const { addToCart } = useStore();
  return (
    <div className="row-card">
      <Link to={`/product/${product.id}`} className="row-card__img" ref={imgRef} tabIndex={-1} aria-hidden="true"><ProductImage product={product} shadow={false} /></Link>
      <div className="row-card__txt">
        <Link to={`/product/${product.id}`}>{product.name}</Link>
        <small>{product.tagline}</small>
        <span className="row-card__price">{formatPrice(product.price)}</span>
      </div>
      <button type="button" className="add-pill" onClick={() => addToCart(product, { color: product.colors[0].name, sourceEl: imgRef.current })} aria-label={`Add ${product.name} to bag`}>
        <PlusIcon width={18} height={18} /><span>Add</span>
      </button>
    </div>
  );
}

function Audio() {
  const pro = getProduct('airpods-pro-3');
  const max = getProduct('airpods-max');
  const [maxColor, setMaxColor] = useState(max.colors[0]);
  const proRef = useRef(null);
  const maxRef = useRef(null);
  const { addToCart } = useStore();
  return (
    <section className="hsec">
      <div className="container">
        <SectionHead title="Sound that moves you." sub="Every AirPods, in one place." to="/shop/airpods" cta="Shop AirPods" />
        <div className="audio">
          <Reveal className="audio__cell">
            <article className="feat">
              <div className="feat__copy">
                <p className="feat__eyebrow">{pro.badge}</p>
                <h3><Link to={`/product/${pro.id}`}>{pro.name}</Link></h3>
                <p>{pro.tagline}</p>
                <ul className="feat__chips">{pro.highlights.slice(0, 3).map((h) => <li key={h}>{h}</li>)}</ul>
              </div>
              <Link to={`/product/${pro.id}`} className="feat__img" ref={proRef} tabIndex={-1} aria-hidden="true"><ProductImage product={pro} shadow={false} /></Link>
              <div className="feat__foot">
                <span className="feat__price">{formatPrice(pro.price)}</span>
                <div className="feat__ctas">
                  <button type="button" className="add-pill" onClick={() => addToCart(pro, { color: pro.colors[0].name, sourceEl: proRef.current })} aria-label={`Add ${pro.name} to bag`}><PlusIcon width={18} height={18} /><span>Add</span></button>
                  <Link to={`/product/${pro.id}`} className="btn btn--dark btn--sm">Buy</Link>
                </div>
              </div>
            </article>
          </Reveal>
          <Reveal delay={100} className="audio__cell">
            <article className="feat feat--tint" style={{ '--tint': maxColor.hex }}>
              <div className="feat__copy">
                <p className="feat__eyebrow feat__eyebrow--muted">Over-ear</p>
                <h3><Link to={`/product/${max.id}`}>{max.name}</Link></h3>
                <p>{max.tagline}</p>
              </div>
              <Link to={`/product/${max.id}`} className="feat__img" ref={maxRef} tabIndex={-1} aria-hidden="true">
                <ProductImage key={maxColor.name} product={max} color={maxColor} shadow={false} />
              </Link>
              <div className="feat__foot">
                <div className="feat__color">
                  <ColorDots product={max} color={maxColor} onChange={setMaxColor} />
                  <span aria-live="polite">{maxColor.name}</span>
                </div>
                <div className="feat__ctas">
                  <span className="feat__price">{formatPrice(max.price)}</span>
                  <button type="button" className="add-pill" onClick={() => addToCart(max, { color: maxColor.name, sourceEl: maxRef.current })} aria-label={`Add ${max.name} to bag`}><PlusIcon width={18} height={18} /><span>Add</span></button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
        <div className="row-cards">
          {['airpods-4-anc', 'airpods-4'].map((id, i) => <Reveal key={id} delay={i * 80}><RowCard product={getProduct(id)} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- ESSENTIALS */
const essentialGroups = [
  { id: 'power', label: 'Power banks', ids: ['magsafe-battery', 'powercore-10k', 'powercore-20k'] },
  { id: 'charging', label: 'Charging', ids: ['magsafe-charger', 'usb-c-20w-adapter', 'usb-c-cable'] },
  { id: 'cases', label: 'Cases', ids: ['silicone-case-17-pro', 'clear-case-17-pro'] },
  { id: 'tracking', label: 'AirTag', ids: ['airtag-4-pack'] },
];
const allEssentials = essentialGroups.flatMap((g) => g.ids);
const essentialFilters = [{ id: 'all', label: 'All', ids: allEssentials }, ...essentialGroups];

function Essentials() {
  const [group, setGroup] = useState('all');
  const ids = essentialFilters.find((g) => g.id === group).ids;
  return (
    <section className="hsec">
      <div className="container">
        <SectionHead title="Essentials." sub="Keep everything charged and protected." to="/shop/accessories" cta="All accessories" />
        <div className="fchips" role="group" aria-label="Filter essentials">
          {essentialFilters.map((f) => (
            <button key={f.id} type="button" className={`fchip ${group === f.id ? 'is-on' : ''}`} aria-pressed={group === f.id} onClick={() => setGroup(f.id)}>
              {f.label}<span>{f.ids.length}</span>
            </button>
          ))}
        </div>
        <div key={group} className="grid ess-grid">
          {ids.map((id, i) => <div key={id} className="ess-item" style={{ '--i': i }}><ProductCard product={getProduct(id)} /></div>)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- PERKS */
function Perks() {
  const pickup = STORE.shippingOptions.find((o) => o.id === 'pickup');
  const perks = [
    [TruckIcon, 'Free delivery', `On orders over ${formatPrice(STORE.freeShippingThreshold)}.`],
    [ReturnIcon, 'Free 14-day returns', 'No questions asked.'],
    [ShieldIcon, '1-year warranty', 'Genuine products, fully covered.'],
    [StoreIcon, 'Store pickup', pickup ? `${pickup.eta}.` : 'Collect in store.'],
  ];
  return (
    <section className="hsec">
      <div className="container">
        <Reveal className="perks">
          {perks.map(([Icon, title, text]) => (
            <div key={title} className="perk">
              <span className="perk__icon"><Icon width={22} height={22} /></span>
              <div><strong>{title}</strong><p>{text}</p></div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- NEWSLETTER */
function Newsletter() {
  const { notify } = useStore();
  return (
    <section className="hsec hsec--last">
      <div className="container">
        <Reveal className="news">
          <div>
            <p className="eyebrow">Stay in the loop</p>
            <h2>Launch alerts, exclusive drops and early access.</h2>
            <p className="news__sub">Be first to know when new devices land at {STORE.name}.</p>
          </div>
          <div>
            <form className="news__form" onSubmit={(e) => { e.preventDefault(); e.target.reset(); notify('You’re on the list ✓'); }}>
              <label htmlFor="news-email" className="sr-only">Email address</label>
              <input id="news-email" type="email" required placeholder="you@email.com" autoComplete="email" />
              <button className="btn btn--primary">Subscribe</button>
            </form>
            <p className="news__fine">No spam. Unsubscribe anytime.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Latest />
      <Compare />
      <Audio />
      <Essentials />
      <Perks />
      <Newsletter />
    </>
  );
}
