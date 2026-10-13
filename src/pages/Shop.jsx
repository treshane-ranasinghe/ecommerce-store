import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import SplitText from '../components/SplitText';
import { CloseIcon } from '../components/Icons';

const sorts = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top Rated', fn: (a, b) => b.rating - a.rating },
};

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'featured';
  const cat = categories.find((c) => c.id === category);
  const pillsRef = useRef(null);
  const [ind, setInd] = useState(null);

  const list = useMemo(() => {
    const t = q.toLowerCase();
    return products
      .filter((p) => !category || p.category === category)
      .filter((p) => !t || `${p.name} ${p.category} ${p.tagline}`.toLowerCase().includes(t))
      .sort(sorts[sort]?.fn || sorts.featured.fn);
  }, [category, q, sort]);

  // Slide the glass indicator under the active category pill.
  useLayoutEffect(() => {
    const measure = () => {
      const el = pillsRef.current?.querySelector('.pill.is-on');
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [category]);

  const qs = params.toString() ? `?${params}` : '';
  const setSort = (v) => { const n = new URLSearchParams(params); n.set('sort', v); setParams(n, { replace: true }); };
  const clearQ = () => { const n = new URLSearchParams(params); n.delete('q'); setParams(n, { replace: true }); };

  return (
    <div className="shop">
      <header className="shop__hero container">
        <p className="eyebrow anim-in">{cat ? 'Category' : `${products.length} products`}</p>
        <h1 key={category || 'all'} className="shop__title"><SplitText text={cat ? cat.name : 'Store.'} by="char" play stagger={40} /></h1>
        <p className="shop__sub anim-in" style={{ '--d': '300ms' }}>{cat ? cat.blurb : 'The best way to buy the products you love.'}</p>
      </header>

      <div className="filter-bar">
        <div className="container filter-bar__inner">
          <div className="pills liquid" ref={pillsRef} role="tablist">
            {ind && <span className="pills__ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />}
            <Link to={`/shop${qs}`} className={`pill ${!category ? 'is-on' : ''}`}>All</Link>
            {categories.map((c) => (
              <Link key={c.id} to={`/shop/${c.id}${qs}`} className={`pill ${category === c.id ? 'is-on' : ''}`}>{c.name}</Link>
            ))}
          </div>
          <label className="sort liquid">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(sorts).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <section className="container shop__body">
        <div className="shop__meta">
          <span>{list.length} result{list.length !== 1 && 's'}</span>
          {q && <button className="chip" onClick={clearQ}>“{q}” <CloseIcon width={14} height={14} /></button>}
        </div>
        {list.length === 0 ? (
          <div className="empty">
            <h2>No results found.</h2>
            <p>Try a different search or browse all products.</p>
            <Link to="/shop" className="btn btn--primary">View all products</Link>
          </div>
        ) : (
          <div className="grid">
            {list.map((p, i) => (
              <Reveal key={p.id} variant="scale" delay={(i % 4) * 80}><ProductCard product={p} /></Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
