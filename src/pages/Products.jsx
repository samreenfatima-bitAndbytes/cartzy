import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import ProductMedia from "../components/ProductMedia";
import { useStore } from "../hooks/useStore";

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const empty = {
  name: "",
  price: "",
  stock: "10",
  category: "General",
  description: "",
};

export default function Products() {
  const { products, addProduct, updateProduct, removeProduct } = useStore();
  const [form, setForm] = useState(empty);
  const [removeId, setRemoveId] = useState(null);

  function onAdd(e) {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) return;
    addProduct({
      name: form.name.trim(),
      price,
      stock: Number.isFinite(stock) ? stock : 10,
      category: form.category.trim() || "General",
      description: form.description.trim() || "New product listing.",
      tone: "#9EB6A8",
      image: "/img/product-tray.jpg",
    });
    setForm(empty);
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
          <p className="muted">Add and tune listings that appear on your storefront.</p>
        </div>
      </header>

      <form className="panel form-grid" onSubmit={onAdd}>
        <h2>Add product</h2>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <div className="form-inline">
          <label>
            Price
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Add to catalog
        </button>
      </form>

      <div className="product-manage-grid">
        {products.map((p) => (
          <article key={p.id} className="product-manage">
            <ProductMedia image={p.image} tone={p.tone} name={p.name} />
            <div className="product-manage-body">
              <div className="product-manage-top">
                <h3>{p.name}</h3>
                <strong>{money(p.price)}</strong>
              </div>
              <p className="muted">{p.description}</p>
              <div className="form-inline form-inline--2">
                <label>
                  Stock
                  <input
                    type="number"
                    min="0"
                    value={p.stock}
                    onChange={(e) =>
                      updateProduct(p.id, { stock: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={p.price}
                    onChange={(e) =>
                      updateProduct(p.id, {
                        price: Number(e.target.value) || p.price,
                      })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setRemoveId(p.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(removeId)}
        title="Remove product?"
        body="It will disappear from the storefront and cart."
        confirmLabel="Remove"
        onCancel={() => setRemoveId(null)}
        onConfirm={() => {
          removeProduct(removeId);
          setRemoveId(null);
        }}
      />
    </div>
  );
}
