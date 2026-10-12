import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProduct, priceFor } from '../data/products';
import { STORE } from '../config';
import { flyToBag } from '../lib/flyToBag';

const StoreContext = createContext(null);

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

export const lineKey = (id, color, option) => [id, color, option].join('|');

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('nova.cart', []));
  const [wishlist, setWishlist] = useState(() => load('nova.wishlist', []));
  const [promo, setPromo] = useState(() => load('nova.promo', null));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [island, setIsland] = useState(null);
  const [bump, setBump] = useState(0);
  const islandTimer = useRef();

  useEffect(() => save('nova.cart', cart), [cart]);
  useEffect(() => save('nova.wishlist', wishlist), [wishlist]);
  useEffect(() => save('nova.promo', promo), [promo]);

  // Dynamic-Island style notifications in the nav.
  const showIsland = useCallback((data, ms = 3200) => {
    clearTimeout(islandTimer.current);
    setIsland({ ...data, id: Date.now() });
    islandTimer.current = setTimeout(() => setIsland(null), ms);
  }, []);
  const notify = useCallback((message) => showIsland({ kind: 'msg', message }, 2400), [showIsland]);

  const addToCart = useCallback((product, { color, option, qty = 1, openDrawer = false, sourceEl } = {}) => {
    const c = color ?? product.colors?.[0]?.name ?? '';
    const o = option ?? product.storage?.[0]?.label ?? '';
    const key = lineKey(product.id, c, o);
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
      return [...prev, { key, id: product.id, color: c, option: o, qty }];
    });
    flyToBag(sourceEl);
    setTimeout(() => setBump((b) => b + 1), sourceEl ? 800 : 0);
    if (openDrawer) setDrawerOpen(true);
    else showIsland({ kind: 'cart', product, color: product.colors?.find((x) => x.name === c), option: o, qty });
  }, [showIsland]);

  const setQty = useCallback((key, qty) => {
    setCart((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l))));
  }, []);

  const removeLine = useCallback((key) => setCart((prev) => prev.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => { setCart([]); setPromo(null); }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      notify(has ? 'Removed from your saved items' : 'Saved for later ♥');
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, [notify]);

  const applyPromo = useCallback((code) => {
    const c = code.trim().toUpperCase();
    if (!STORE.promoCodes[c]) return false;
    setPromo(c);
    return true;
  }, []);

  // Resolve cart lines to full product data + totals.
  const lines = useMemo(() => cart
    .map((l) => {
      const product = getProduct(l.id);
      if (!product) return null;
      const color = product.colors?.find((c) => c.name === l.color);
      const unit = priceFor(product, l.option);
      return { ...l, product, colorObj: color, unit, total: unit * l.qty };
    })
    .filter(Boolean), [cart]);

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const p = promo && STORE.promoCodes[promo];
    let discount = 0;
    if (p && (!p.min || subtotal >= p.min)) discount = p.type === 'percent' ? subtotal * (p.value / 100) : Math.min(p.value, subtotal);
    return { subtotal, count, discount, promo: p ? { code: promo, ...p, active: discount > 0 } : null };
  }, [lines, promo]);

  const value = {
    lines, totals, wishlist, drawerOpen, island, bump,
    addToCart, setQty, removeLine, clearCart, toggleWishlist, applyPromo,
    removePromo: () => setPromo(null), setDrawerOpen, notify, dismissIsland: () => setIsland(null),
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
