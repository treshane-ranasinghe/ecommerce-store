import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Preloader from './components/Preloader';
import useInteractions from './hooks/useInteractions';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

// Intro plays once per browser session.
const shouldIntro = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem('nova.intro');
  } catch {
    return false;
  }
};

export default function App() {
  const { pathname } = useLocation();
  const [intro, setIntro] = useState(shouldIntro);
  useInteractions();

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('ready', !intro);
    document.body.style.overflow = intro ? 'hidden' : '';
  }, [intro]);

  const done = useCallback(() => {
    try { sessionStorage.setItem('nova.intro', '1'); } catch { /* ignore */ }
    setIntro(false);
  }, []);

  return (
    <>
      {intro && <Preloader onDone={done} />}
      <Navbar />
      <main key={pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:orderId" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
