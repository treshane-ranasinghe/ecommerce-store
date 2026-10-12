import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, STORE } from '../config';
import { ProductImage } from './ProductArt';
import QtyStepper from './QtyStepper';
import { CloseIcon, BagIcon } from './Icons';

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, totals, setQty, removeLine } = useStore();
  const navigate = useNavigate();
  const close = () => setDrawerOpen(false);
  const go = (to) => { close(); navigate(to); };

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [drawerOpen]);

  const remaining = STORE.freeShippingThreshold - totals.subtotal;

  return (
    <div className={`drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="drawer__backdrop" onClick={close} />
      <aside className="drawer__panel glass" role="dialog" aria-label="Your bag">
        <div className="drawer__head">
          <h2>Bag <span>{totals.count > 0 && `· ${totals.count} item${totals.count > 1 ? 's' : ''}`}</span></h2>
          <button className="icon-btn" onClick={close} aria-label="Close bag"><CloseIcon /></button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <div className="empty-icon"><BagIcon width={34} height={34} /></div>
            <h3>Your bag is empty.</h3>
            <p>Find something you love.</p>
            <button className="btn btn--primary" onClick={() => go('/shop')}>Continue Shopping</button>
          </div>
        ) : (
          <>
            {totals.subtotal > 0 && (
              <div className="ship-meter">
                <p>{remaining > 0 ? <>You’re <strong>{formatPrice(remaining)}</strong> away from free delivery</> : <>🎉 You’ve unlocked <strong>free delivery</strong></>}</p>
                <div className="ship-meter__bar"><span style={{ width: `${Math.min(100, (totals.subtotal / STORE.freeShippingThreshold) * 100)}%` }} /></div>
              </div>
            )}
            <ul className="drawer__lines">
              {lines.map((l, i) => (
                <li key={l.key} className="line" style={{ '--i': i }}>
                  <Link to={`/product/${l.id}`} onClick={close} className="line__img"><ProductImage product={l.product} color={l.colorObj} shadow={false} /></Link>
                  <div className="line__info">
                    <Link to={`/product/${l.id}`} onClick={close} className="line__name">{l.product.name}</Link>
                    <p className="line__meta">{[l.color, l.option].filter(Boolean).join(' · ')}</p>
                    <div className="line__row">
                      <QtyStepper small value={l.qty} min={0} onChange={(v) => setQty(l.key, v)} />
                      <strong>{formatPrice(l.total)}</strong>
                    </div>
                    <button className="link-btn" onClick={() => removeLine(l.key)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="sum-row"><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></div>
              <p className="muted small">Shipping & taxes calculated at checkout.</p>
              <button className="btn btn--primary btn--block" onClick={() => go('/checkout')}>Check Out</button>
              <button className="btn btn--ghost btn--block" onClick={() => go('/cart')}>View Bag</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
