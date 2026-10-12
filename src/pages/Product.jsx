import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProduct, priceFor, products, categories } from '../data/products';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../config';
import { ProductImage } from '../components/ProductArt';
import ProductCard from '../components/ProductCard';
import QtyStepper from '../components/QtyStepper';
import Stars from '../components/Stars';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import NotFound from './NotFound';
import { HeartIcon, TruckIcon, StoreIcon, ReturnIcon, ChevronDown, ChevronRight } from '../components/Icons';

function Accordion({ title, children, open: initial }) {
  const [open, setOpen] = useState(!!initial);
  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <button className="acc__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}<ChevronDown />
      </button>
      <div className="acc__body"><div>{children}</div></div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id);
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [color, setColor] = useState(product?.colors?.[0]);
  const [option, setOption] = useState(product?.storage?.[0]?.label);
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef(null);
  const artRef = useRef(null);

  useEffect(() => {
    setColor(product?.colors?.[0]);
    setOption(product?.storage?.[0]?.label);
    setQty(1);
  }, [id]);

  // Mobile sticky "Add to Bag" bar appears once the main buttons scroll away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  if (!product) return <NotFound />;

  const price = priceFor(product, option);
  const saved = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || p.category === 'accessories')).slice(0, 4);
  const add = () => addToCart(product, { color: color?.name, option, qty, sourceEl: artRef.current });
  const buyNow = () => { addToCart(product, { color: color?.name, option, qty, openDrawer: false }); navigate('/checkout'); };

  return (
    <div className="pdp">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop">Store</Link><ChevronRight width={12} height={12} />
          <Link to={`/shop/${product.category}`}>{categories.find((c) => c.id === product.category)?.name}</Link><ChevronRight width={12} height={12} />
          <span>{product.name}</span>
        </nav>

        <div className="pdp__grid">
          <div className="pdp__gallery">
            <div className="pdp__stage liquid spot" data-tilt="6" style={{ '--tint': color?.hex || '#8e8e93' }}>
              <div className="pdp__tint" />
              <span className="pdp__ghost" aria-hidden="true">{product.name.replace(/^(iPhone|AirPods)\s*/, '') || product.name}</span>
              <div ref={artRef} key={color?.name} className="pdp__art"><ProductImage product={product} color={color} shadow={false} /></div>
              {product.badge && <span className="pcard__badge">{product.badge}</span>}
            </div>
            {product.colors.length > 1 && (
              <div className="pdp__thumbs">
                {product.colors.map((c) => (
                  <button key={c.name} className={`thumb glass ${color?.name === c.name ? 'is-on' : ''}`} onClick={() => setColor(c)} aria-label={c.name}>
                    <ProductImage product={product} color={c} shadow={false} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp__info">
            <h1><SplitText text={product.name} play /></h1>
            <p className="pdp__tagline anim-in" style={{ '--d': '80ms' }}>{product.tagline}</p>
            <div className="anim-in" style={{ '--d': '140ms' }}><Stars rating={product.rating} reviews={product.reviews} /></div>
            <p className="pdp__price anim-in" style={{ '--d': '200ms' }}>
              <span key={price} className="price-pop">{formatPrice(price)}</span>
              {price >= 500 && <small>or {formatPrice(price / 24)}/mo. for 24 mo.</small>}
            </p>

            {product.colors.length > 0 && (
              <div className="opt-group">
                <p className="opt-label">Color — <strong>{color?.name}</strong></p>
                <div className="swatches" role="radiogroup" aria-label="Color">
                  {product.colors.map((c) => (
                    <button key={c.name} role="radio" aria-checked={color?.name === c.name} aria-label={c.name} title={c.name}
                      className={`swatch ${color?.name === c.name ? 'is-on' : ''}`} style={{ '--c': c.hex }} onClick={() => setColor(c)} />
                  ))}
                </div>
              </div>
            )}

            {product.storage?.length > 0 && (
              <div className="opt-group">
                <p className="opt-label">{product.optionLabel || 'Storage'}</p>
                <div className="opt-cards" role="radiogroup">
                  {product.storage.map((s) => (
                    <button key={s.label} role="radio" aria-checked={option === s.label} className={`opt-card ${option === s.label ? 'is-on' : ''}`} onClick={() => setOption(s.label)}>
                      <strong>{s.label}</strong>
                      <span>{formatPrice(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="opt-group">
              <p className="opt-label">Quantity</p>
              <QtyStepper value={qty} onChange={setQty} />
            </div>

            <div className="pdp__buy" ref={buyRef}>
              <button className="btn btn--primary btn--lg" onClick={add} data-magnetic>Add to Bag</button>
              <button className="btn btn--dark btn--lg" onClick={buyNow}>Buy Now</button>
              <button className={`icon-btn glass heart-lg ${saved ? 'is-on' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label="Save for later"><HeartIcon /></button>
            </div>

            <div className="delivery glass">
              <div><TruckIcon /><span><strong>Free delivery</strong> Arrives in 3–5 business days</span></div>
              <div><StoreIcon /><span><strong>Pick up in store</strong> Available today at our flagship store</span></div>
              <div><ReturnIcon /><span><strong>Free 14-day returns</strong> Easy and hassle-free</span></div>
            </div>

            <div className="accs">
              <Accordion title="Overview" open>
                <p>{product.description}</p>
                <ul className="ticks">{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
              </Accordion>
              <Accordion title="Tech Specs">
                <dl className="specs">{Object.entries(product.specs).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              </Accordion>
              <Accordion title="What’s in the Box">
                <ul className="ticks">{product.inBox.map((h) => <li key={h}>{h}</li>)}</ul>
              </Accordion>
            </div>
          </div>
        </div>

        <section className="section">
          <Reveal as="h2" className="section__title">Pairs well with.<span> Complete your setup.</span></Reveal>
          <div className="grid">
            {related.map((p, i) => <Reveal key={p.id} delay={i * 80}><ProductCard product={p} /></Reveal>)}
          </div>
        </section>
      </div>

      <div className={`buy-bar glass ${showBar ? 'is-on' : ''}`}>
        <div>
          <strong>{product.name}</strong>
          <span>{formatPrice(price * qty)}</span>
        </div>
        <button className="btn btn--primary btn--sm" onClick={add}>Add to Bag</button>
      </div>
    </div>
  );
}
