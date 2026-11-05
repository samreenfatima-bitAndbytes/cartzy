import { useStore } from "../hooks/useStore";

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function when(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Fulfillment</p>
          <h1>Orders</h1>
          <p className="muted">Track paid checkouts and mark them fulfilled.</p>
        </div>
      </header>

      <div className="orders-table">
        {orders.map((o) => (
          <article key={o.id} className="order-card">
            <div className="order-card-head">
              <div>
                <h2>{o.customer}</h2>
                <p className="muted">
                  {o.email} · {o.id} · {when(o.createdAt)}
                </p>
              </div>
              <div className="order-card-side">
                <span className={`pill status-${o.status}`}>{o.status}</span>
                <strong>{money(o.total)}</strong>
              </div>
            </div>
            <ul className="order-items">
              {o.items.map((i) => (
                <li key={`${o.id}-${i.productId}`}>
                  {i.qty}× {i.name}
                  <span>{money(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            {o.status === "paid" ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => updateOrderStatus(o.id, "fulfilled")}
              >
                Mark fulfilled
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
