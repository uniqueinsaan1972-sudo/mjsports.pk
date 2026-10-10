"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { DELIVERY_FEE } from "@/lib/siteConfig";
import { fetchCoupon } from "@/lib/firebasePublic";

const CartContext = createContext(null);
const STORAGE_KEY = "mj_cart_v1";

// Codes that already existed on the site before coupons were managed in the admin panel.
const LEGACY_COUPONS = {
  MJ10: { type: "percent", value: 10 },
  WELCOME5: { type: "percent", value: 5 },
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // "pickup" | "home"
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((i) => i && i.key && i.price >= 0 && i.qty > 0));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const addItem = useCallback(
    (product, qty = 1, variants = {}) => {
      setItems((prev) => {
        const variantKey = Object.entries(variants || {})
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([k, v]) => `${k}:${v}`)
          .join("|");
        const key = `${product.slug}-${variantKey || "default"}`;
        const existing = prev.find((i) => i.key === key);
        if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
        return [
          ...prev,
          { key, slug: product.slug, name: product.name, price: product.price, variants: variants || {}, qty, category: product.category, thumbnail: product.thumbnail },
        ];
      });
      showToast(`${product.name} added to cart`);
    },
    [showToast]
  );

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, qty) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, Math.max(1, qty)) } : i)));
  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDeliveryMethod("pickup");
  };

  // Returns { ok: true } or { ok: false, error }
  const applyCoupon = async (code) => {
    const upper = String(code || "").trim().toUpperCase();
    if (!upper) return { ok: false, error: "Enter a coupon code." };
    try {
      const remote = await fetchCoupon(upper);
      if (remote) {
        if (remote.active === false) return { ok: false, error: "This coupon is not active." };
        if (remote.limit != null && Number(remote.usedCount || 0) >= Number(remote.limit))
          return { ok: false, error: "This coupon has reached its usage limit." };
        const type = remote.discountType === "fixed" ? "fixed" : "percent";
        setCoupon({ code: upper, type, value: Number(remote.discountValue) || 0 });
        return { ok: true };
      }
    } catch {
      /* fall through to legacy codes */
    }
    if (LEGACY_COUPONS[upper]) {
      setCoupon({ code: upper, ...LEGACY_COUPONS[upper] });
      return { ok: true };
    }
    setCoupon(null);
    return { ok: false, error: "Invalid coupon code." };
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const rawDiscount = !coupon ? 0 : coupon.type === "fixed" ? coupon.value : Math.round((subtotal * coupon.value) / 100);
  const discount = Math.min(subtotal, Math.max(0, rawDiscount));
  const deliveryFee = deliveryMethod === "home" ? DELIVERY_FEE : 0;
  const total = subtotal - discount + deliveryFee;
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, applyCoupon, coupon, subtotal, discount, deliveryFee, deliveryMethod, setDeliveryMethod, total, count }}
    >
      {children}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>{toast.message}</span>
            <Link href="/cart" onClick={() => setToast(null)}>View cart</Link>
          </>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
