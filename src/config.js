// Store-wide settings. Change currency/locale here (e.g. 'LKR' / 'en-LK').
export const STORE = {
  name: 'Nova',
  currency: 'USD',
  locale: 'en-US',
  freeShippingThreshold: 50,
  taxRate: 0.08,
  shippingOptions: [
    { id: 'standard', label: 'Standard Delivery', eta: '3–5 business days', price: 0 },
    { id: 'express', label: 'Express Delivery', eta: '1–2 business days', price: 14.99 },
    { id: 'pickup', label: 'Store Pickup', eta: 'Ready in 2 hours', price: 0 },
  ],
  promoCodes: {
    WELCOME10: { type: 'percent', value: 10, label: '10% off your order' },
    SAVE50: { type: 'fixed', value: 50, label: '$50 off', min: 500 },
  },
};

export const formatPrice = (n) =>
  new Intl.NumberFormat(STORE.locale, { style: 'currency', currency: STORE.currency }).format(n);

// Home page hero. `image` is a transparent PNG shown in the hero regardless of the selected colour
// (set it to null to use the product's colour photos/illustrations instead).
// imageLayout 'wide' = a close-up that rises from the bottom edge; 'tall' = a standing phone.
export const HERO = {
  productId: 'iphone-17-pro-max',
  image: '/products/hero-iphone-17-pro-max-closeup.png',
  imageLayout: 'wide',
  eyebrow: 'New',
  title: 'iPhone 17 Pro Max',
  bigWord: 'PRO MAX',
};
