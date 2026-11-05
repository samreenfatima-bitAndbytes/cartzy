import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_ORDERS, SEED_PRODUCTS, SEED_SHOPS } from "../data/seed";

const KEY = "cartzy_data_v4";
const Ctx = createContext(null);

function seed() {
  return {
    shops: SEED_SHOPS.map((s) => ({ ...s })),
    activeShopId: SEED_SHOPS[0].id,
    products: SEED_PRODUCTS.map((p) => ({ ...p })),
    orders: SEED_ORDERS.map((o) => ({
      ...o,
      items: o.items.map((i) => ({ ...i })),
    })),
    /** cart lines keyed by shopId */
    carts: {},
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    const base = seed();
    const shops = Array.isArray(parsed.shops) && parsed.shops.length
      ? parsed.shops
      : base.shops;
    const activeShopId =
      shops.some((s) => s.id === parsed.activeShopId)
        ? parsed.activeShopId
        : shops[0].id;
    return {
      shops,
      activeShopId,
      products: Array.isArray(parsed.products) ? parsed.products : base.products,
      orders: Array.isArray(parsed.orders) ? parsed.orders : base.orders,
      carts:
        parsed.carts && typeof parsed.carts === "object" ? parsed.carts : {},
    };
  } catch {
    return seed();
  }
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(load);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const flash = useCallback((msg) => setToast(msg), []);

  const shop = useMemo(
    () =>
      data.shops.find((s) => s.id === data.activeShopId) || data.shops[0],
    [data.shops, data.activeShopId]
  );

  const products = useMemo(
    () => data.products.filter((p) => p.shopId === shop?.id),
    [data.products, shop?.id]
  );

  const orders = useMemo(
    () => data.orders.filter((o) => o.shopId === shop?.id),
    [data.orders, shop?.id]
  );

  const setActiveShop = useCallback((shopId) => {
    setData((d) => {
      if (!d.shops.some((s) => s.id === shopId)) return d;
      return { ...d, activeShopId: shopId };
    });
  }, []);

  const getShopBySlug = useCallback(
    (slug) => data.shops.find((s) => s.slug === slug) || null,
    [data.shops]
  );

  const productsForShop = useCallback(
    (shopId) => data.products.filter((p) => p.shopId === shopId),
    [data.products]
  );

  const updateShop = useCallback((patch) => {
    setData((d) => ({
      ...d,
      shops: d.shops.map((s) =>
        s.id === d.activeShopId ? { ...s, ...patch } : s
      ),
    }));
  }, []);

  const addProduct = useCallback(
    (product) => {
      setData((d) => ({
        ...d,
        products: [
          {
            id: `p${Date.now()}`,
            shopId: d.activeShopId,
            stock: 10,
            category: "General",
            tone: "#C5D0C8",
            image: "/img/product-tray.jpg",
            ...product,
          },
          ...d.products,
        ],
      }));
      flash("Product added");
    },
    [flash]
  );

  const updateProduct = useCallback((id, patch) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removeProduct = useCallback(
    (id) => {
      setData((d) => {
        const product = d.products.find((p) => p.id === id);
        const shopId = product?.shopId;
        const nextCarts = { ...d.carts };
        if (shopId && nextCarts[shopId]) {
          nextCarts[shopId] = nextCarts[shopId].filter(
            (c) => c.productId !== id
          );
        }
        return {
          ...d,
          products: d.products.filter((p) => p.id !== id),
          carts: nextCarts,
        };
      });
      flash("Product removed");
    },
    [flash]
  );

  const addToCart = useCallback(
    (shopId, productId, qty = 1) => {
      setData((d) => {
        const product = d.products.find(
          (p) => p.id === productId && p.shopId === shopId
        );
        if (!product) return d;
        const cart = d.carts[shopId] || [];
        const existing = cart.find((c) => c.productId === productId);
        const nextCart = existing
          ? cart.map((c) =>
              c.productId === productId
                ? { ...c, qty: Math.min(c.qty + qty, product.stock) }
                : c
            )
          : [...cart, { productId, qty: Math.min(qty, product.stock) }];
        return {
          ...d,
          carts: { ...d.carts, [shopId]: nextCart },
        };
      });
      flash("Added to cart");
    },
    [flash]
  );

  const setCartQty = useCallback((shopId, productId, qty) => {
    setData((d) => {
      const cart = d.carts[shopId] || [];
      const nextCart =
        qty <= 0
          ? cart.filter((c) => c.productId !== productId)
          : cart.map((c) =>
              c.productId === productId ? { ...c, qty } : c
            );
      return {
        ...d,
        carts: { ...d.carts, [shopId]: nextCart },
      };
    });
  }, []);

  const clearCart = useCallback((shopId) => {
    setData((d) => ({
      ...d,
      carts: { ...d.carts, [shopId]: [] },
    }));
  }, []);

  const cartForShop = useCallback(
    (shopId) => {
      const cart = data.carts[shopId] || [];
      return cart
        .map((c) => {
          const product = data.products.find(
            (p) => p.id === c.productId && p.shopId === shopId
          );
          if (!product) return null;
          return { ...c, product, lineTotal: product.price * c.qty };
        })
        .filter(Boolean);
    },
    [data.carts, data.products]
  );

  const placeOrder = useCallback(
    ({ shopId, customer, email }) => {
      let order = null;
      setData((d) => {
        const cart = d.carts[shopId] || [];
        const catalog = d.products.filter((p) => p.shopId === shopId);
        const items = cart
          .map((c) => {
            const p = catalog.find((x) => x.id === c.productId);
            if (!p) return null;
            return {
              productId: p.id,
              name: p.name,
              qty: c.qty,
              price: p.price,
            };
          })
          .filter(Boolean);
        if (!items.length) return d;
        const total = items.reduce((s, i) => s + i.price * i.qty, 0);
        order = {
          id: `o${Date.now()}`,
          shopId,
          customer,
          email,
          total,
          status: "paid",
          createdAt: new Date().toISOString(),
          items,
        };
        const products = d.products.map((p) => {
          if (p.shopId !== shopId) return p;
          const line = items.find((i) => i.productId === p.id);
          if (!line) return p;
          return { ...p, stock: Math.max(0, p.stock - line.qty) };
        });
        return {
          ...d,
          products,
          orders: [order, ...d.orders],
          carts: { ...d.carts, [shopId]: [] },
        };
      });
      if (order) flash("Order placed");
      return order;
    },
    [flash]
  );

  const updateOrderStatus = useCallback(
    (id, status) => {
      setData((d) => ({
        ...d,
        orders: d.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));
      flash(`Order marked ${status}`);
    },
    [flash]
  );

  const resetDemo = useCallback(() => {
    setData(seed());
    flash("Demo data reset");
  }, [flash]);

  const value = useMemo(
    () => ({
      shops: data.shops,
      activeShopId: data.activeShopId,
      shop,
      products,
      orders,
      toast,
      flash,
      setActiveShop,
      getShopBySlug,
      productsForShop,
      cartForShop,
      updateShop,
      addProduct,
      updateProduct,
      removeProduct,
      addToCart,
      setCartQty,
      clearCart,
      placeOrder,
      updateOrderStatus,
      resetDemo,
    }),
    [
      data.shops,
      data.activeShopId,
      shop,
      products,
      orders,
      toast,
      flash,
      setActiveShop,
      getShopBySlug,
      productsForShop,
      cartForShop,
      updateShop,
      addProduct,
      updateProduct,
      removeProduct,
      addToCart,
      setCartQty,
      clearCart,
      placeOrder,
      updateOrderStatus,
      resetDemo,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}
