import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../hooks/useAuth.jsx";
import { useStore } from "../hooks/useStore";

export default function Landing() {
  const { user } = useAuth();
  const { shop, shops, products } = useStore();

  return (
    <div className="landing">
      <header className="site-nav site-nav--sticky">
        <Link to="/" className="brand">
          <BrandLogo />
          Cartzy
        </Link>
        <div className="topbar-actions">
          <Link className="btn btn-ghost-light" to={`/s/${shop.slug}`}>
            Sample shop
          </Link>
          <Link className="btn btn-accent" to={user ? "/app" : "/login"}>
            {user ? "Open builder" : "Sign in"}
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-visual" aria-hidden="true">
          <img src="/img/hero-shop.jpg" alt="" />
          <div className="hero-scrim" />
        </div>

        <div className="hero-stage">
          <div className="hero-copy">
            <p className="brand-hero">Cartzy</p>
            <h1>Launch a digital shop. Checkout in minutes.</h1>
            <p className="lead">
              Build your storefront, list products, and take payments with a
              streamlined checkout — from one merchant workspace.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-accent" to={user ? "/app" : "/login"}>
                {user ? "Go to dashboard" : "Try the demo"}
              </Link>
              <Link className="btn btn-ghost-light" to={`/s/${shop.slug}`}>
                Browse Northloom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap section-split">
          <div>
            <div className="section-head">
              <h2>From blank shop to live checkout</h2>
              <p className="muted">
                Compose the storefront, manage catalog and orders, then let
                customers buy through a short one-screen checkout.
              </p>
            </div>
            <ol className="flow-list">
              <li>
                <span className="step">01</span>
                <div>
                  <strong>Compose</strong>
                  <span className="muted">Name, accent, and publish state</span>
                </div>
              </li>
              <li>
                <span className="step">02</span>
                <div>
                  <strong>Catalog</strong>
                  <span className="muted">Products, stock, and pricing</span>
                </div>
              </li>
              <li>
                <span className="step">03</span>
                <div>
                  <strong>Checkout</strong>
                  <span className="muted">Bag, pay, and fulfill orders</span>
                </div>
              </li>
            </ol>
          </div>
          <figure className="photo-frame">
            <img
              src="/img/feature-checkout.jpg"
              alt="Customer checking out on a phone"
            />
          </figure>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">On Cartzy</p>
            <h2>More shops on Cartzy</h2>
            <p className="muted">
              Two live demo storefronts from one merchant workspace — switch shops
              in the builder anytime.
            </p>
          </div>
          <div className="landing-shops">
            {shops.map((s) => (
              <Link
                key={s.id}
                to={`/s/${s.slug}`}
                className="landing-shop"
                style={{ "--shop-accent": s.accent }}
              >
                <img src={s.banner} alt="" loading="lazy" />
                <div className="landing-shop-body">
                  <strong>{s.name}</strong>
                  <span className="muted">{s.tagline}</span>
                  <span className="landing-shop-slug">/s/{s.slug}</span>
                  <span className="landing-shop-cta">Visit storefront →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <div className="section-head section-head--row">
            <div>
              <h2>{shop.name} catalog</h2>
              <p className="muted">Preview products from the active demo shop.</p>
            </div>
            <Link className="btn btn-ghost" to={`/s/${shop.slug}`}>
              View storefront
            </Link>
          </div>
          <div className="landing-products">
            {products.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/s/${shop.slug}`}
                className="landing-product"
              >
                <img src={p.image} alt={p.name} loading="lazy" />
                <div className="landing-product-meta">
                  <strong>{p.name}</strong>
                  <span className="muted">${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--band">
        <div className="wrap cta-row">
          <div>
            <h2>Open the merchant builder</h2>
            <p className="muted">
              Sign in as Jordan Hale and switch between Northloom and Fieldkit.
            </p>
          </div>
          <Link className="btn btn-primary" to={user ? "/app" : "/login"}>
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
