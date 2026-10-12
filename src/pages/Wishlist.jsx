import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getProduct } from '../data/products';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { HeartIcon } from '../components/Icons';

export default function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="container shop">
      <header className="shop__hero">
        <h1 className="anim-in">Saved. <span>Your favourites, all in one place.</span></h1>
      </header>
      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><HeartIcon width={34} height={34} /></div>
          <h2>Nothing saved yet.</h2>
          <p>Tap the heart on any product to save it here.</p>
          <Link to="/shop" className="btn btn--primary">Browse the Store</Link>
        </div>
      ) : (
        <div className="grid">{items.map((p, i) => <Reveal key={p.id} delay={i * 70}><ProductCard product={p} /></Reveal>)}</div>
      )}
    </div>
  );
}
