Product photos (transparent WebP, trimmed to the product, max 1000px on the long edge).

Naming:
  <product-id>-<colour>.webp   per-colour photo, set on colors[].image in src/data/products.js
  <product-id>.webp            single photo, set on product.image
  hero-iphone-17-pro-max-closeup.png   home hero (see HERO in src/config.js)

Any product or colour without a photo (or whose file fails to load) falls back to the
built-in SVG illustration.

Use official images from Apple's authorised-reseller / partner marketing kit.
