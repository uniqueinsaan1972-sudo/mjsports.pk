"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import Link from "next/link";

const CartContext = createContext(null);

// Simple coupon table — later this can move to Firestore so you can manage codes from admin.
const COUPONS = {
  MJ10: 0.10,
  WELCOME5: 0.05,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, id: Date.now() });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const addItem = useCallback((product, qty = 1, weight = null) => {
    setItems((prev) => {
      const key = `${product.slug}-${weight || "default"}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { key, slug: product.slug, name: product.name, price: product.price, weight, qty, grad: product.grad }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, qty) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));
  const clearCart = () => { setItems([]); setCoupon(null); };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      setCoupon({ code: upper, rate: COUPONS[upper] });
      return true;
    }
    setCoupon(null);
    return false;
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = coupon ? Math.round(subtotal * coupon.rate) : 0;
  const total = subtotal - discount;
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, applyCoupon, coupon, subtotal, discount, total, count }}
    >
      {children}
      <div className={`mj-toast ${toast ? "show" : ""}`}>
        {toast && (
          <>
            <span>&#9989; {toast.message}</span>
            <Link href="/cart" onClick={() => setToast(null)}>View Cart</Link>
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