import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice, STORE } from '../config';
import { ProductImage } from '../components/ProductArt';
import { PromoBox } from './Cart';
import { CardIcon, CashIcon, PhoneIcon, LockIcon, ChevronDown, ChevronRight, BagIcon } from '../components/Icons';

const steps = ['Details', 'Delivery', 'Payment'];

const emptyForm = {
  email: '', phone: '', firstName: '', lastName: '', address: '', apt: '', city: '', postal: '', country: 'United States',
  shipping: 'standard', payment: 'card', cardName: '', cardNumber: '', expiry: '', cvc: '', saveInfo: true,
};

const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const cardBrand = (n) => (/^4/.test(n) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : /^3[47]/.test(n) ? 'AMEX' : '');

function validate(step, f) {
  const e = {};
  if (step === 0) {
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number.';
    ['firstName', 'lastName', 'address', 'city', 'postal'].forEach((k) => { if (!f[k].trim()) e[k] = 'Required'; });
  }
  if (step === 2 && f.payment === 'card') {
    if (!f.cardName.trim()) e.cardName = 'Enter the name on the card.';
    if (f.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Enter a valid card number.';
    const [mm, yy] = f.expiry.split('/');
    if (!mm || !yy || +mm < 1 || +mm > 12 || yy.length < 2) e.expiry = 'MM/YY';
    if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = '3–4 digits';
  }
  return e;
}

function Field({ label, name, form, errors, onChange, className = '', ...rest }) {
  return (
    <label className={`field ${errors[name] ? 'has-err' : ''} ${form[name] ? 'has-val' : ''} ${className}`}>
      <input name={name} value={form[name]} onChange={onChange} placeholder=" " {...rest} />
      <span>{label}</span>
      {errors[name] && <em className="field-err">{errors[name]}</em>}
    </label>
  );
}

function CardPreview({ form, flipped }) {
  const brand = cardBrand(form.cardNumber.replace(/\s/g, ''));
  return (
    <div className={`card-3d ${flipped ? 'is-flipped' : ''}`} aria-hidden="true">
      <div className="card-3d__inner">
        <div className="card-face card-face--front">
          <div className="card-chip" />
          <span className="card-brand">{brand}</span>
          <div className="card-num">{(form.cardNumber || '•••• •••• •••• ••••').padEnd(19, '•')}</div>
          <div className="card-bottom">
            <div><small>Card holder</small><span>{form.cardName || 'YOUR NAME'}</span></div>
            <div><small>Expires</small><span>{form.expiry || 'MM/YY'}</span></div>
          </div>
        </div>
        <div className="card-face card-face--back">
          <div className="card-stripe" />
          <div className="card-cvc"><span>{form.cvc ? form.cvc.replace(/./g, '•') : 'CVC'}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { lines, totals, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...emptyForm, ...JSON.parse(localStorage.getItem('nova.customer') || '{}') }; } catch { return emptyForm; }
  });
  const [errors, setErrors] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const ship = STORE.shippingOptions.find((s) => s.id === form.shipping);
  const shipping = form.shipping === 'standard' && totals.subtotal < STORE.freeShippingThreshold ? 9.99 : ship.price;
  const tax = (totals.subtotal - totals.discount) * STORE.taxRate;
  const total = totals.subtotal - totals.discount + shipping + tax;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === 'checkbox' ? checked : value;
    if (name === 'cardNumber') v = formatCard(value);
    if (name === 'expiry') v = formatExpiry(value);
    if (name === 'cvc') v = value.replace(/\D/g, '').slice(0, 4);
    setForm((f) => ({ ...f, [name]: v }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };
  const fp = { form, errors, onChange };

  const next = () => {
    const e = validate(step, form);
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector('.field.has-err input')?.focus();
      return;
    }
    if (step < 2) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    placeOrder();
  };

  const placeOrder = () => {
    setPlacing(true);
    if (form.saveInfo) {
      const { cardNumber, cvc, expiry, cardName, ...keep } = form;
      try { localStorage.setItem('nova.customer', JSON.stringify(keep)); } catch { /* ignore */ }
    }
    // TODO(backend): POST the order to the API and redirect with the real order id.
    setTimeout(() => {
      const id = `NV${Date.now().toString().slice(-8)}`;
      const order = {
        id, date: new Date().toISOString(),
        lines: lines.map(({ key, id: pid, product, color, option, qty, unit, total: t, colorObj }) => ({ key, id: pid, name: product.name, color, option, qty, unit, total: t, hex: colorObj?.hex })),
        subtotal: totals.subtotal, discount: totals.discount, shipping, tax, total,
        customer: { email: form.email, name: `${form.firstName} ${form.lastName}`, address: [form.address, form.apt, form.city, form.postal, form.country].filter(Boolean).join(', ') },
        delivery: ship, payment: form.payment,
      };
      try { localStorage.setItem('nova.lastOrder', JSON.stringify(order)); } catch { /* ignore */ }
      clearCart();
      navigate(`/order/${id}`, { replace: true });
    }, 1800);
  };

  if (lines.length === 0 && !placing) {
    return (
      <div className="container cart-empty">
        <div className="empty-icon"><BagIcon width={40} height={40} /></div>
        <h1>Your bag is empty.</h1>
        <p>Add something to your bag before checking out.</p>
        <Link to="/shop" className="btn btn--primary">Shop Now</Link>
      </div>
    );
  }

  const summary = (
    <>
      <ul className="co-lines">
        {lines.map((l) => (
          <li key={l.key}>
            <span className="co-lines__img glass"><ProductImage product={l.product} color={l.colorObj} shadow={false} /><em>{l.qty}</em></span>
            <span className="co-lines__name"><strong>{l.product.name}</strong><small>{[l.color, l.option].filter(Boolean).join(' · ')}</small></span>
            <span>{formatPrice(l.total)}</span>
          </li>
        ))}
      </ul>
      <PromoBox />
      <div className="sum-row"><span>Subtotal</span><span>{formatPrice(totals.subtotal)}</span></div>
      {totals.discount > 0 && <div className="sum-row sum-row--green"><span>Discount</span><span>−{formatPrice(totals.discount)}</span></div>}
      <div className="sum-row"><span>Shipping</span><span>{step === 0 ? 'Calculated next' : shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
      <div className="sum-row"><span>Estimated tax</span><span>{formatPrice(tax)}</span></div>
      <div className="sum-row sum-row--total"><span>Total</span><span>{formatPrice(total)}</span></div>
    </>
  );

  return (
    <div className="checkout">
      <div className="co-mobile-sum glass">
        <button onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen}>
          <span>{summaryOpen ? 'Hide' : 'Show'} order summary <ChevronDown className={summaryOpen ? 'rot' : ''} width={16} height={16} /></span>
          <strong>{formatPrice(total)}</strong>
        </button>
        <div className={`co-mobile-sum__body ${summaryOpen ? 'is-open' : ''}`}><div>{summary}</div></div>
      </div>

      <div className="container co-grid">
        <div className="co-main">
          <h1 className="anim-in">Checkout</h1>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s} className={`${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
                <button disabled={i > step} onClick={() => setStep(i)}><span>{i < step ? '✓' : i + 1}</span>{s}</button>
              </li>
            ))}
          </ol>

          <div key={step} className="co-step">
            {step === 0 && (
              <>
                <h2>Contact information</h2>
                <div className="fields">
                  <Field label="Email address" name="email" type="email" autoComplete="email" className="span-2" {...fp} />
                  <Field label="Phone number" name="phone" type="tel" autoComplete="tel" className="span-2" {...fp} />
                </div>
                <h2>Shipping address</h2>
                <div className="fields">
                  <Field label="First name" name="firstName" autoComplete="given-name" {...fp} />
                  <Field label="Last name" name="lastName" autoComplete="family-name" {...fp} />
                  <Field label="Street address" name="address" autoComplete="address-line1" className="span-2" {...fp} />
                  <Field label="Apartment, suite, etc. (optional)" name="apt" autoComplete="address-line2" className="span-2" {...fp} />
                  <Field label="City" name="city" autoComplete="address-level2" {...fp} />
                  <Field label="Postal code" name="postal" autoComplete="postal-code" {...fp} />
                  <label className="field has-val span-2">
                    <select name="country" value={form.country} onChange={onChange}>
                      {['United States', 'United Kingdom', 'Sri Lanka', 'India', 'Australia', 'Canada', 'United Arab Emirates'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <span>Country / Region</span>
                  </label>
                </div>
                <label className="check"><input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={onChange} /><span />Save this information for next time</label>
              </>
            )}

            {step === 1 && (
              <>
                <h2>Delivery method</h2>
                <div className="radio-cards">
                  {STORE.shippingOptions.map((o) => {
                    const price = o.id === 'standard' && totals.subtotal < STORE.freeShippingThreshold ? 9.99 : o.price;
                    return (
                      <label key={o.id} className={`radio-card glass ${form.shipping === o.id ? 'is-on' : ''}`}>
                        <input type="radio" name="shipping" value={o.id} checked={form.shipping === o.id} onChange={onChange} />
                        <span className="radio-dot" />
                        <span className="radio-card__txt"><strong>{o.label}</strong><small>{o.eta}</small></span>
                        <strong>{price === 0 ? 'FREE' : formatPrice(price)}</strong>
                      </label>
                    );
                  })}
                </div>
                <div className="review glass">
                  <div><small>Contact</small><span>{form.email}</span><button className="link-btn" onClick={() => setStep(0)}>Change</button></div>
                  <div><small>Ship to</small><span>{[form.address, form.city, form.postal, form.country].filter(Boolean).join(', ')}</span><button className="link-btn" onClick={() => setStep(0)}>Change</button></div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2>Payment</h2>
                <p className="muted small"><LockIcon width={13} height={13} /> All transactions are secure and encrypted.</p>
                <div className="pay-tabs">
                  {[['card', 'Card', CardIcon], ['applepay', 'Apple Pay', PhoneIcon], ['cod', 'Cash on Delivery', CashIcon]].map(([id, label, Icon]) => (
                    <label key={id} className={`pay-tab glass ${form.payment === id ? 'is-on' : ''}`}>
                      <input type="radio" name="payment" value={id} checked={form.payment === id} onChange={onChange} />
                      <Icon /><span>{label}</span>
                    </label>
                  ))}
                </div>
                {form.payment === 'card' && (
                  <div className="pay-card">
                    <CardPreview form={form} flipped={flipped} />
                    <div className="fields">
                      <Field label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" className="span-2" {...fp} />
                      <Field label="Name on card" name="cardName" autoComplete="cc-name" className="span-2" {...fp} />
                      <Field label="Expiry (MM/YY)" name="expiry" inputMode="numeric" autoComplete="cc-exp" {...fp} />
                      <Field label="CVC" name="cvc" inputMode="numeric" autoComplete="cc-csc" onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} {...fp} />
                    </div>
                  </div>
                )}
                {form.payment === 'applepay' && <div className="pay-note glass">You’ll confirm payment with Face ID or Touch ID after placing your order.</div>}
                {form.payment === 'cod' && <div className="pay-note glass">Pay with cash or card when your order is delivered. A small verification call may be made before dispatch.</div>}
                <div className="review glass">
                  <div><small>Contact</small><span>{form.email}</span><button className="link-btn" onClick={() => setStep(0)}>Change</button></div>
                  <div><small>Ship to</small><span>{[form.address, form.city, form.country].filter(Boolean).join(', ')}</span><button className="link-btn" onClick={() => setStep(0)}>Change</button></div>
                  <div><small>Method</small><span>{ship.label} · {ship.eta}</span><button className="link-btn" onClick={() => setStep(1)}>Change</button></div>
                </div>
              </>
            )}
          </div>

          <div className="co-nav">
            {step > 0 ? <button className="link-btn" onClick={() => setStep(step - 1)}>‹ Back</button> : <Link to="/cart" className="link-btn">‹ Return to bag</Link>}
            <button className="btn btn--primary btn--lg" onClick={next} disabled={placing}>
              {placing ? <span className="spinner" /> : step < 2 ? <>Continue to {steps[step + 1]} <ChevronRight width={16} height={16} /></> : `Place Order · ${formatPrice(total)}`}
            </button>
          </div>
        </div>

        <aside className="co-side">
          <div className="summary glass">
            <h2>Order Summary</h2>
            {summary}
          </div>
        </aside>
      </div>

      {placing && (
        <div className="placing">
          <div className="placing__box glass">
            <span className="spinner spinner--lg" />
            <p>Processing your order…</p>
          </div>
        </div>
      )}
    </div>
  );
}
