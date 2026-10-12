# Nova Store — frontend demo

Vite + React storefront for iPhone, AirPods, power banks and accessories. Frontend only: cart, saved items and orders are stored in the browser (localStorage) until the backend exists.

```bash
npm install
npm run dev      # http://localhost:5173 (also on your LAN for phone testing)
npm run build    # production build in dist/
```

- **Products:** `src/data/products.js`. Swap for an API call later.
- **Store settings** (name, currency, shipping, tax, promo codes, hero): `src/config.js`
- **Real product photos:** see `public/products/README.txt`. Missing photos fall back to the built-in illustrations.
- **Order placement:** `placeOrder()` in `src/pages/Checkout.jsx` (marked `TODO(backend)`).
- Demo promo codes: `WELCOME10` (10% off), `SAVE50` ($50 off orders over $500).
