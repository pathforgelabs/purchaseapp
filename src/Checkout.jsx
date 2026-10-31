import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react'

function Checkout({ cart, setCart }) {
  const navigate = useNavigate()
  const [placed, setPlaced] = useState(false)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const updateQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0),
    )
  }

  const placeOrder = (event) => {
    event.preventDefault()
    setPlaced(true)
    setCart([])
  }

  if (placed) {
    return (
      <div className="checkout-success">
        <div className="success-mark"><Check size={32} /></div>
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you for your order.</h1>
        <p>A confirmation will be sent to your email shortly.</p>
        <button className="primary-button" onClick={() => navigate('/')}>Continue shopping</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button className="brand" onClick={() => navigate('/')}>
          <span className="brand-mark">H</span>
          <span>Hearth <em>&</em> Home</span>
        </button>
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to shop</button>
        <span className="secure-label"><LockKeyhole size={14} /> Secure checkout</span>
      </header>

      <div className="checkout-layout">
        <main className="checkout-form">
          <div className="checkout-progress"><span className="active">Information</span><b>›</b><span>Payment</span><b>›</b><span>Review</span></div>
          <form id="checkout-form" onSubmit={placeOrder}>
            <section>
              <div className="checkout-section-title"><span>1</span><h2>Contact</h2></div>
              <label>Email address<input type="email" required placeholder="you@example.com" /></label>
              <label className="check-label"><input type="checkbox" /> Email me with news and offers</label>
            </section>

            <section>
              <div className="checkout-section-title"><span>2</span><h2>Delivery address</h2></div>
              <div className="field-grid two">
                <label>First name<input required /></label>
                <label>Last name<input required /></label>
              </div>
              <label>Address<input required placeholder="Street address" /></label>
              <div className="field-grid three">
                <label>City<input required /></label>
                <label>State<input required /></label>
                <label>ZIP code<input required /></label>
              </div>
              <label className="check-label"><input type="checkbox" defaultChecked /> Save this address for next time</label>
            </section>

            <section>
              <div className="checkout-section-title"><span>3</span><h2>Delivery method</h2></div>
              <label className="delivery-option">
                <input type="radio" name="delivery" defaultChecked />
                <span><strong>Standard delivery</strong><small>3–5 business days</small></span>
                <b>{shipping === 0 ? 'Free' : `$${shipping}`}</b>
              </label>
              <label className="delivery-option">
                <input type="radio" name="delivery" />
                <span><strong>Express delivery</strong><small>1–2 business days</small></span>
                <b>$24</b>
              </label>
            </section>

            <section>
              <div className="checkout-section-title"><span>4</span><h2>Payment</h2></div>
              <div className="payment-box">
                <div className="payment-head"><span><CreditCard size={18} /> Credit or debit card</span><ShieldCheck size={18} /></div>
                <label>Card number<div className="card-input"><input required inputMode="numeric" placeholder="1234 5678 9012 3456" /><span>VISA</span></div></label>
                <div className="field-grid two">
                  <label>Expiration<input required placeholder="MM / YY" /></label>
                  <label>Security code<input required inputMode="numeric" placeholder="CVC" /></label>
                </div>
              </div>
            </section>
          </form>
        </main>

        <aside className="order-summary">
          <p className="eyebrow">Order summary</p>
          <h2>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag</h2>
          {cart.length === 0 ? (
            <div className="summary-empty">
              <p>Your bag is empty.</p>
              <button className="text-button" onClick={() => navigate('/')}>Return to shop</button>
            </div>
          ) : cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <div className="summary-image">
                <img src={item.image} alt={item.name} />
                <span>{item.quantity}</span>
              </div>
              <div><h3>{item.name}</h3><small>{item.category}</small></div>
              <strong>${item.price * item.quantity}</strong>
              <div className="summary-quantity">
                <button type="button" onClick={() => updateQuantity(item.id, -1)}>−</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
          <div className="summary-totals">
            <div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div><span>Delivery</span><strong>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</strong></div>
            <div><span>Estimated tax</span><strong>${tax.toFixed(2)}</strong></div>
            <div className="grand-total"><span>Total</span><strong><small>USD</small> ${total.toFixed(2)}</strong></div>
          </div>
          <button className="pay-button" form="checkout-form" type="submit" disabled={cart.length === 0}>
            <LockKeyhole size={16} /> Pay ${total.toFixed(2)}
          </button>
          <p className="payment-note"><ShieldCheck size={14} /> Your payment information is secure</p>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
