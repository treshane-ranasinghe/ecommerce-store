import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, STORE } from '../config';
import { ProductImage } from '../components/ProductArt';
import QtyStepper from '../components/QtyStepper';
import Reveal from '../components/Reveal';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { TagIcon, CloseIcon, LockIcon, BagIcon } from '../components/Icons';

export function PromoBox() {
  const { totals, applyPromo, removePromo } = useStore();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  if (totals.promo) {
    return (
      <div className="promo-applied">
        <TagIcon width={16} height={16} />
        <span><strong>{totals.promo.code}</strong> {totals.promo.active ? totals.promo.label : `— spend ${formatPrice(totals.promo.min)} to activate`}</span>
        <button className="icon-btn" onClick={removePromo} aria-label="Remove promo code"><CloseIcon width={16} height={16} /></button>
      </div>
    );
  }
  return (
    <form className="promo" onSubmit={(e) => { e.preventDefault(); if (!applyPromo(code)) setErr('That code isn’t valid.'); else { setErr(''); setCode(''); } }}>
      <div className="promo__row">
        <input value={code} onChange={(e) => { setCode(e.target.value); setErr(''); }} placeholder="Promo code" aria-label="Promo code" />
        <button className="btn btn--outline btn--sm" disabled={!code.trim()}>Apply</button>
      </div>
      {err ? <p className="field-err">{err}</p> : <p className="muted small">Try <strong>WELCOME10</strong></p>}
    </form>
  );
}

export default function Cart() {
  const { lines, totals, setQty, removeLine, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const shipping = totals.subtotal >= STORE.freeShippingThreshold || totals.subtotal === 0 ? 0 : 9.99;
  const tax = (totals.subtotal - totals.discount) * STORE.taxRate;
  const total = totals.subtotal - totals.discount + shipping + tax;

  if (lines.length === 0) {
    return (
      <div className="container cart-empty">
        <div className="empty-icon anim-in"><BagIcon width={40} height={40} /></div>
        <h1 className="anim-in" style={{ '--d': '80ms' }}>Your bag is empty.</h1>
        <p className="anim-in" style={{ '--d': '160ms' }}>Free delivery and free returns on everything.</p>
        <Link to="/shop" className="btn btn--primary anim-in" style={{ '--d': '240ms' }}>Continue Shopping</Link>
        <section className="section">
          <h2 className="section__title">You might like.</h2>
          <div className="grid">{products.filter((p) => p.badge).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      </div>
    );
  }

  return (
    <div className="container cart">
      <header className="cart__head">
        <h1 className="anim-in">Review your bag.</h1>
        <p className="anim-in" style={{ '--d': '80ms' }}>Free delivery and free returns.</p>
      </header>
      <div className="cart__grid">
        <ul className="cart__lines">
          {lines.map((l, i) => (
            <Reveal as="li" key={l.key} delay={i * 60} className="cart-line">
              <Link to={`/product/${l.id}`} className="cart-line__img glass"><ProductImage product={l.product} color={l.colorObj} /></Link>
              <div className="cart-line__info">
                <div className="cart-line__top">
                  <div>
                    <Link to={`/product/${l.id}`} className="cart-line__name">{l.product.name}</Link>
                    <p className="line__meta">{[l.color, l.option].filter(Boolean).join(' · ')}</p>
                    <p className="line__meta">{formatPrice(l.unit)} each</p>
                  </div>
                  <strong className="cart-line__price">{formatPrice(l.total)}</strong>
                </div>
                <div className="cart-line__actions">
                  <QtyStepper value={l.qty} min={0} onChange={(v) => setQty(l.key, v)} />
                  <div>
                    <button className="link-btn" onClick={() => { toggleWishlist(l.id); removeLine(l.key); }}>Save for later</button>
                    <button className="link-btn" onClick={() => removeLine(l.key)}>Remove</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <aside className="summary glass">
          <h2>Order Summary</h2>
          <div className="sum-row"><span>Subtotal ({totals.count} items)</span><span>{formatPrice(totals.subtotal)}</span></div>
          {totals.discount > 0 && <div className="sum-row sum-row--green"><span>Discount</span><span>−{formatPrice(totals.discount)}</span></div>}
          <div className="sum-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="sum-row"><span>Estimated tax</span><span>{formatPrice(tax)}</span></div>
          <PromoBox />
          <div className="sum-row sum-row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn btn--primary btn--block btn--lg" onClick={() => navigate('/checkout')}>Check Out</button>
          <p className="secure"><LockIcon width={14} height={14} /> Secure checkout</p>
        </aside>
      </div>
    </div>
  );
}
