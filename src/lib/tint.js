import { categories } from '../data/products';

const toHsl = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 0xff, n & 0xff].map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Colour for a product's backdrop glow. Keeps the finish's hue but lifts its saturation so pastel
// finishes (Lavender, Sky Blue...) still read as colour. Neutral finishes (white, silver, black)
// have no hue to keep, so they use the category accent instead.
export function tintFor(product, color) {
  const hex = color?.hex || product.colors?.[0]?.hex;
  if (hex) {
    const [h, s, l] = toHsl(hex);
    if (s > 0.12 && l > 0.08 && l < 0.97) {
      return `hsl(${Math.round(h)} ${Math.round(Math.max(s, 0.62) * 100)}% ${Math.round(clamp(l, 0.52, 0.68) * 100)}%)`;
    }
  }
  return categories.find((c) => c.id === product.category)?.accent || '#8e8e93';
}
