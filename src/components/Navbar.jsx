import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { products, categories } from '../data/products';
import { STORE, formatPrice } from '../config';
import { ProductImage } from './ProductArt';
import { BagIcon, SearchIcon, HeartIcon, CloseIcon, ChevronRight } from './Icons';

const links = [
  { to: '/shop', label: 'Store' },
  ...categories.map((c) => ({ to: `/shop/${c.id}`, label: c.name })),
];

function Island() {
  const { island, dismissIsland, setDrawerOpen } = useStore();
  const [shown, setShown] = useState(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (island) { setShown(island); setLeaving(false); return; }
    if (!shown) return;
    setLeaving(true);
    const t = setTimeout(() => { setShown(null); setLeaving(false); }, 450);
    return () => clearTimeout(t);
  }, [island]);

  if (!shown) return null;
  const cart = shown.kind === 'cart';
  return (
    <div key={shown.id} className={`island ${cart ? 'island--cart' : 'island--msg'} ${leaving ? 'is-leaving' : ''}`} role="status">
      <div className="island__content">
        {cart ? (
          <>
            <span className="island__thumb"><ProductImage product={shown.product} color={shown.color} shadow={false} /></span>
            <span className="island__txt">
              <small><span className="island__check">✓</span> Added to Bag</small>
              <strong>{shown.product.name}</strong>
              <em>{[shown.color?.name, shown.option].filter(Boolean).join(' · ')}</em>
            </span>
            <button className="island__btn" onClick={() => { dismissIsland(); setDrawerOpen(true); }}>View</button>
          </>
        ) : (
          <span className="island__msg"><span className="island__pulse" />{shown.message}</span>
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { totals, setDrawerOpen, bump, wishlist, island } = useStore();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState('');
  const loc = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY, raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 10);
      if (Math.abs(y - lastY) > 6) { setHidden(y > lastY && y > 240); lastY = y; }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => { setMenu(false); setSearch(false); setHidden(false); }, [loc.pathname, loc.search]);

  useEffect(() => {
    document.body.style.overflow = menu || search ? 'hidden' : '';
    if (search) setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e) => { if (e.key === 'Escape') { setSearch(false); setMenu(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, search]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) => `${p.name} ${p.category} ${p.tagline}`.toLowerCase().includes(t)).slice(0, 6);
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };
  const open = menu || search;
  const isHidden = hidden && !open && !island;
  useEffect(() => { document.documentElement.classList.toggle('nav-hidden', isHidden); }, [isHidden]);

  return (
    <>
      <header className={`nav ${isHidden ? 'is-hidden' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="nav__pill liquid">
          <Link to="/" className="nav__logo" aria-label={`${STORE.name} home`}>
            <span className="nav__logo-dot" />{STORE.name}
          </Link>
          <nav className="nav__links" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={({ isActive }) => (isActive ? 'active' : '')}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="nav__actions">
            <button className="icon-btn" onClick={() => { setSearch((s) => !s); setMenu(false); }} aria-label="Search">
              {search ? <CloseIcon /> : <SearchIcon />}
            </button>
            <Link to="/wishlist" className="icon-btn hide-sm" aria-label="Saved items">
              <HeartIcon />
              {wishlist.length > 0 && <span className="badge-dot" />}
            </Link>
            <button className="icon-btn bag-btn" data-bag-target onClick={() => setDrawerOpen(true)} aria-label={`Bag, ${totals.count} items`}>
              <BagIcon />
              {totals.count > 0 && <span key={bump} className="bag-count">{totals.count}</span>}
            </button>
            <button className={`icon-btn show-sm burger ${menu ? 'is-x' : ''}`} onClick={() => { setMenu((m) => !m); setSearch(false); }} aria-label="Menu">
              <span /><span />
            </button>
          </div>
        </div>
        <Island />
      </header>

      <div className={`sheet search-sheet ${search ? 'is-open' : ''}`} aria-hidden={!search}>
        <div className="sheet__panel">
          <form onSubmit={submit} className="search-form">
            <SearchIcon width={26} height={26} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search iPhone, AirPods…" aria-label="Search products" />
          </form>
          {results.length > 0 ? (
            <ul className="search-results">
              {results.map((p, i) => (
                <li key={p.id} style={{ '--i': i }}>
                  <Link to={`/product/${p.id}`}>
                    <span className="search-thumb"><ProductImage product={p} shadow={false} /></span>
                    <span className="search-results__txt"><strong>{p.name}</strong><small>{formatPrice(p.price)}</small></span>
                    <ChevronRight width={16} height={16} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="quick-links">
              <p className="eyebrow">Popular</p>
              <div className="quick-links__row">
                {['iPhone 17 Pro', 'AirPods Pro 3', 'MagSafe', 'Power bank', 'iPhone Air'].map((t, i) => (
                  <button key={t} type="button" className="chip" style={{ '--i': i }} onClick={() => setQ(t)}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="sheet__backdrop" onClick={() => setSearch(false)} />
      </div>

      <div className={`sheet menu-sheet ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <div className="sheet__panel">
          <nav className="menu-links">
            {[...links, { to: '/wishlist', label: 'Saved' }, { to: '/cart', label: `Bag${totals.count ? ` (${totals.count})` : ''}` }].map((l, i) => (
              <Link key={l.to} to={l.to} style={{ '--i': i }}><span>{String(i + 1).padStart(2, '0')}</span>{l.label}</Link>
            ))}
          </nav>
          <div className="menu-foot" style={{ '--i': 8 }}>Free delivery over {formatPrice(STORE.freeShippingThreshold)} · 14-day returns</div>
        </div>
      </div>
    </>
  );
}
