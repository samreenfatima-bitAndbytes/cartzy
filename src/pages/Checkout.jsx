import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import ProductMedia from "../components/ProductMedia";
import { useStore } from "../hooks/useStore";

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    getShopBySlug,
    cartForShop,
    setCartQty,
    placeOrder,
    shops,
  } = useStore();
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(null);

  const shop = getShopBySlug(slug);
  const cartLines = shop ? cartForShop(shop.id) : [];
  const cartTotal = cartLines.reduce((s, l) => s + l.lineTotal, 0);

  if (!shop) {
    const fallback = shops[0];
    return (
      <Navigate
        to={fallback ? `/s/${fallback.slug}/checkout` : "/"}
        replace
      />
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!cartLines.length) return;
    const order = placeOrder({
      shopId: shop.id,
      customer: customer.trim(),
      email: email.trim(),
    });
    if (order) setDone(order);
  }

  if (done) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <img src="/img/feature-checkout.jpg" alt="" className="success-img" />
          <p className="eyebrow">Order confirmed</p>
          <h1>Thanks, {done.customer}</h1>
          <p className="muted">
            {done.id} · {money(done.total)} charged in this demo (no real payment).
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to={`/s/${shop.slug}`}>
              Back to shop
            </Link>
            <Link className="btn btn-ghost" to="/app/orders">
              Merchant orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ "--shop-accent": shop.accent }}>
      <header className="checkout-nav">
        <div className="checkout-nav-links">
          <Link to="/" className="store-back">
            ← Cartzy
          </Link>
          <Link to={`/s/${shop.slug}`} className="muted">
            ← {shop.name}
          </Link>
        </div>
        <strong>Checkout</strong>
      </header>

      {!cartLines.length ? (
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p className="muted">Add a few pieces from {shop.name}, then come back.</p>
          <Link className="btn btn-primary" to={`/s/${shop.slug}`}>
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="checkout-grid">
          <form className="panel form-grid" onSubmit={onSubmit}>
            <h1>Streamlined checkout</h1>
            <p className="muted">Name, email, pay — no extra steps in this demo.</p>
            <label>
              Full name
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Card (demo)
              <input
                defaultValue="4242 4242 4242 4242"
                readOnly
                aria-readonly="true"
              />
            </label>
            <button type="submit" className="btn btn-accent btn-block">
              Pay {money(cartTotal)}
            </button>
          </form>

          <aside className="panel">
            <h2>Order summary</h2>
            <ul className="cart-lines">
              {cartLines.map((l) => (
                <li key={l.productId}>
                  <ProductMedia
                    className="cart-thumb"
                    image={l.product.image}
                    tone={l.product.tone}
                    name={l.product.name}
                  />
                  <div className="cart-line-body">
                    <strong>{l.product.name}</strong>
                    <div className="qty-row">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() =>
                          setCartQty(shop.id, l.productId, l.qty - 1)
                        }
                      >
                        −
                      </button>
                      <span>{l.qty}</span>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() =>
                          setCartQty(
                            shop.id,
                            l.productId,
                            Math.min(l.qty + 1, l.product.stock)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong>{money(l.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Total</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={() => navigate(`/s/${shop.slug}`)}
            >
              Keep shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
