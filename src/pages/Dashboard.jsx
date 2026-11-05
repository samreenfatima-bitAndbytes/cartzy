import { Link } from "react-router-dom";
import ProductMedia from "../components/ProductMedia";
import { useStore } from "../hooks/useStore";

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function Dashboard() {
  const { shop, shops, products, orders, resetDemo } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const openOrders = orders.filter((o) => o.status === "paid").length;

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>{shop.name}</h1>
          <p className="muted">
            {shop.published ? "Published" : "Draft"} · /s/{shop.slug}
            {shops.length > 1 ? ` · ${shops.length} shops` : ""}
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn btn-ghost" onClick={resetDemo}>
            Reset demo
          </button>
          <Link className="btn btn-accent" to={`/s/${shop.slug}`}>
            Preview storefront
          </Link>
        </div>
      </header>

      <div className="dash-hero dash-hero--compact">
        <img src="/img/overview-desk.jpg" alt="" />
        <div className="dash-hero-copy">
          <p className="eyebrow">Workspace</p>
          <h2>{shop.tagline}</h2>
          <Link className="btn btn-ghost-light" to={`/s/${shop.slug}`}>
            Open customer view
          </Link>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat">
          <span className="stat-label">Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat">
          <span className="stat-label">Awaiting fulfillment</span>
          <strong>{openOrders}</strong>
        </div>
        <div className="stat">
          <span className="stat-label">Revenue</span>
          <strong>{money(revenue)}</strong>
        </div>
      </div>

      <div className="dash-split">
        <section className="panel">
          <div className="panel-head">
            <h2>Recent orders</h2>
            <Link to="/app/orders">View all</Link>
          </div>
          <ul className="order-list">
            {orders.slice(0, 4).map((o) => (
              <li key={o.id}>
                <div>
                  <strong>{o.customer}</strong>
                  <span className="muted"> · {o.id}</span>
                </div>
                <div className="order-meta">
                  <span className={`pill status-${o.status}`}>{o.status}</span>
                  <strong>{money(o.total)}</strong>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Top products</h2>
            <Link to="/app/products">Manage</Link>
          </div>
          <ul className="dash-products">
            {products.slice(0, 4).map((p) => (
              <li key={p.id}>
                <ProductMedia
                  className="dash-thumb"
                  image={p.image}
                  tone={p.tone}
                  name={p.name}
                />
                <div>
                  <strong>{p.name}</strong>
                  <span className="muted">
                    {money(p.price)} · {p.stock} left
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
