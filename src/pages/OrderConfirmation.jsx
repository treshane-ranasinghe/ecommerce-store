import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../config';
import { getProduct } from '../data/products';
import { ProductImage } from '../components/ProductArt';
import Reveal from '../components/Reveal';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  let order = null;
  try { order = JSON.parse(localStorage.getItem('nova.lastOrder') || 'null'); } catch { /* ignore */ }
  if (order?.id !== orderId) order = null;

  const eta = new Date();
  eta.setDate(eta.getDate() + (order?.delivery?.id === 'express' ? 2 : 5));

  return (
    <div className="container confirm">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <i key={i} style={{ '--a': `${(i / 36) * 360}deg`, '--r': `${140 + (i * 53) % 180}px`, '--c': ['#ff7a3d', '#ff3d7f', '#8a5cff', '#2fb8ff', '#30d158'][i % 5], '--t': `${(i % 7) * 40}ms` }} />
        ))}
      </div>
      <div className="confirm__check">
        <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-17" /></svg>
      </div>
      <h1 className="anim-in" style={{ '--d': '500ms' }}>Thank you{order ? `, ${order.customer.name.split(' ')[0]}` : ''}.</h1>
      <p className="anim-in" style={{ '--d': '600ms' }}>Your order <strong>#{orderId}</strong> has been placed.{order && <> A confirmation has been sent to <strong>{order.customer.email}</strong>.</>}</p>

      {order && (
        <Reveal className="confirm__card glass" delay={700}>
          <div className="confirm__meta">
            <div><small>Estimated delivery</small><strong>{eta.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong></div>
            <div><small>Delivery</small><strong>{order.delivery.label}</strong></div>
            <div><small>Ship to</small><strong>{order.customer.address}</strong></div>
          </div>
          <ul className="co-lines">
            {order.lines.map((l) => {
              const p = getProduct(l.id);
              return (
                <li key={l.key}>
                  <span className="co-lines__img glass">{p && <ProductImage product={p} color={p.colors.find((c) => c.name === l.color)} shadow={false} />}<em>{l.qty}</em></span>
                  <span className="co-lines__name"><strong>{l.name}</strong><small>{[l.color, l.option].filter(Boolean).join(' · ')}</small></span>
                  <span>{formatPrice(l.total)}</span>
                </li>
              );
            })}
          </ul>
          {order.discount > 0 && <div className="sum-row sum-row--green"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>}
          <div className="sum-row"><span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
          <div className="sum-row"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          <div className="sum-row sum-row--total"><span>Total paid</span><span>{formatPrice(order.total)}</span></div>
        </Reveal>
      )}
      <div className="confirm__ctas anim-in" style={{ '--d': '800ms' }}>
        <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
        <Link to="/" className="btn btn--ghost">Back to Home</Link>
      </div>
    </div>
  );
}
