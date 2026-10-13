import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../config';
import { ProductImage } from './ProductArt';
import { tintFor } from '../lib/tint';
import { HeartIcon, PlusIcon } from './Icons';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [color, setColor] = useState(product.colors?.[0]);
  const imgRef = useRef(null);
  const saved = wishlist.includes(product.id);
  const from = product.storage?.length > 1;

  return (
    <article className="pcard liquid spot" data-tilt="6" style={{ '--tint': tintFor(product, color) }}>
      {product.badge && <span className="pcard__badge">{product.badge}</span>}
      <button className={`pcard__heart ${saved ? 'is-on' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={saved ? 'Remove from saved' : 'Save for later'}>
        <HeartIcon width={18} height={18} />
      </button>
      <Link to={`/product/${product.id}`} className="pcard__media" aria-label={product.name}>
        <span className="pcard__glow" />
        <span ref={imgRef} className="pcard__img">
          <ProductImage key={color?.name} product={product} color={color} className="pcard__art" shadow={false} />
        </span>
      </Link>
      <div className="pcard__body">
        <div className="pcard__row">
          <Link to={`/product/${product.id}`} className="pcard__name">{product.name}</Link>
          {product.colors?.length > 1 && (
            <div className="swatches swatches--sm" role="radiogroup" aria-label="Color">
              {product.colors.slice(0, 5).map((c) => (
                <button key={c.name} role="radio" aria-checked={color?.name === c.name} aria-label={c.name} title={c.name}
                  className={`swatch ${color?.name === c.name ? 'is-on' : ''}`} style={{ '--c': c.hex }} onClick={() => setColor(c)} />
              ))}
            </div>
          )}
        </div>
        <p className="pcard__tag">{product.tagline}</p>
        <div className="pcard__foot">
          <span className="pcard__price">{from && <small>From</small>}{formatPrice(product.price)}</span>
          <button className="add-pill" onClick={() => addToCart(product, { color: color?.name, sourceEl: imgRef.current })} aria-label={`Add ${product.name} to bag`}>
            <PlusIcon width={18} height={18} /><span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
