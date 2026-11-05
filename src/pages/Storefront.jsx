import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ProductMedia from "../components/ProductMedia";
import { useStore } from "../hooks/useStore";

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Storefront() {
  const { slug } = useParams();
  const { getShopBySlug, productsForShop, cartForShop, addToCart, shops } =
    useStore();
  const [category, setCategory] = useState("All");

  const shop = getShopBySlug(slug);
  const products = shop ? productsForShop(shop.id) : [];
  const cartLines = shop ? cartForShop(shop.id) : [];
  const cartTotal = cartLines.reduce((s, l) => s + l.lineTotal, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const visible = useMemo(
    () =>
      category === "All"
        ? products
        : products.filter((p) => p.category === category),
    [products, category]
  );

  if (!shop) {
    const fallback = shops[0];
    return <Navigate to={fallback ? `/s/${fallback.slug}` : "/"} replace />;
  }

  return (
    <div className="storefront" style={{ "--shop-accent": shop.accent }}>
      <header className="store-nav">
        <Link to="/" className="store-back">
          ← Cartzy
        </Link>
        <div className="store-nav-title">
          <span className="store-powered">Powered by Cartzy</span>
          <strong>{shop.name}</strong>
        </div>
        <div className="store-nav-actions">
          <Link className="btn btn-ghost store-builder-link" to="/app">
            Builder
          </Link>
          <Link className="btn btn-cart" to={`/s/${shop.slug}/checkout`}>
            <span>Cart</span>
            <strong>{cartCount}</strong>
            <span className="cart-total-label">{money(cartTotal)}</span>
          </Link>
        </div>
      </header>

      {!shop.published ? (
        <div className="banner">This shop is in draft — preview only.</div>
      ) : null}

      <section className="store-banner">
        <img src={shop.banner || "/img/store-banner.jpg"} alt="" />
        <div className="store-banner-copy">
          <p className="eyebrow">{shop.name}</p>
          <h2>{shop.tagline}</h2>
          <p>Browse the catalog and check out in one short flow.</p>
        </div>
      </section>

      {shops.length > 1 ? (
        <div className="wrap store-network-strip">
          <span className="store-network-label">Also on Cartzy</span>
          <div className="shop-chip-row">
            {shops
              .filter((s) => s.id !== shop.id)
              .map((s) => (
                <Link
                  key={s.id}
                  className="btn btn-accent store-network-btn"
                  to={`/s/${s.slug}`}
                >
                  {s.name} →
                </Link>
              ))}
          </div>
        </div>
      ) : null}

      <div className="wrap store-toolbar">
        <div className="filter-row" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={category === c ? "filter active" : "filter"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="muted">{visible.length} products</p>
      </div>

      <section className="store-grid wrap">
        {visible.map((p) => (
          <article key={p.id} className="store-product">
            <ProductMedia image={p.image} tone={p.tone} name={p.name} />
            <div className="store-product-body">
              <p className="product-cat">{p.category}</p>
              <div className="store-product-top">
                <h3>{p.name}</h3>
                <strong>{money(p.price)}</strong>
              </div>
              <p className="muted">{p.description}</p>
              <div className="store-product-actions">
                <span className="muted">
                  {p.stock > 0 ? `${p.stock} in stock` : "Sold out"}
                </span>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={p.stock < 1}
                  onClick={() => addToCart(shop.id, p.id)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
}
