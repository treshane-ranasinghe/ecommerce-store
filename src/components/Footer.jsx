import { Link } from 'react-router-dom';
import { STORE } from '../config';
import { categories } from '../data/products';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__note">
          Prices include applicable taxes where stated. Free delivery on orders over ${STORE.freeShippingThreshold}. Trade-in values vary by model and condition. Product images are illustrative.
        </p>
        <div className="footer__cols">
          <div>
            <h4>Shop</h4>
            {categories.map((c) => <Link key={c.id} to={`/shop/${c.id}`}>{c.name}</Link>)}
          </div>
          <div>
            <h4>Your Account</h4>
            <Link to="/cart">Bag</Link>
            <Link to="/wishlist">Saved Items</Link>
            <Link to="/checkout">Checkout</Link>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Delivery & Pickup</a>
            <a href="#">Returns & Refunds</a>
            <a href="#">Warranty</a>
          </div>
          <div>
            <h4>About {STORE.name}</h4>
            <a href="#">Our Story</a>
            <a href="#">Store Locations</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
        <div className="footer__mark" aria-hidden="true">{STORE.name.toUpperCase()}</div>
        <div className="footer__base">
          <span>Copyright © {new Date().getFullYear()} {STORE.name}. All rights reserved.</span>
          <span className="footer__legal"><a href="#">Privacy Policy</a><a href="#">Terms of Sale</a></span>
        </div>
      </div>
    </footer>
  );
}
